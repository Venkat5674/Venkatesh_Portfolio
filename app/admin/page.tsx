'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  getDocFromServer
} from 'firebase/firestore';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider, User } from 'firebase/auth';
import { Plus, Pencil, Trash2, X, Save, Layout, Award, LogOut, ShieldCheck, Image as ImageIcon, LogIn, Lock } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  images: string[];
  tags: string[];
  github?: string;
  live?: string;
  order?: number;
}

interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  image: string;
  link?: string;
  techLearned?: string[];
  order?: number;
}

interface Badge {
  id: string;
  name: string;
  issuer: string;
  explanation: string;
  image: string;
  link: string;
  order?: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'certifications' | 'badges'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [isAuth, setIsAuth] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Project Form
  const [projectForm, setProjectForm] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    images: [''],
    tags: '',
    github: '',
    live: '',
    order: '0'
  });

  // Certification Form
  const [certForm, setCertForm] = useState({
    name: '',
    issuer: '',
    date: '',
    image: '',
    link: '',
    techLearned: '',
    order: '0'
  });

  // Badge Form
  const [badgeForm, setBadgeForm] = useState({
    name: '',
    issuer: '',
    explanation: '',
    image: '',
    link: '',
    order: '0'
  });

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const sessionAuth = sessionStorage.getItem('isAdminAuthenticated');
      if (sessionAuth === 'true') {
        setIsAuth(true);
      }
    };

    checkAuth();

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
      if (user && user.email === 'vpamudurti@gmail.com') {
        // Logged in as admin
      }
    });

    return () => unsubAuth();
  }, [router]);

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (!isAuth) return;

    const unsubProjects = onSnapshot(query(collection(db, 'projects')), (snapshot) => {
      setProjects(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Project)));
    });

    const unsubCerts = onSnapshot(query(collection(db, 'certifications')), (snapshot) => {
      setCertifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Certification)));
    });

    const unsubBadges = onSnapshot(query(collection(db, 'badges')), (snapshot) => {
      setBadges(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Badge)));
    });

    return () => {
      unsubProjects();
      unsubCerts();
      unsubBadges();
    };
  }, [isAuth]);

  const handleLogout = async () => {
    sessionStorage.removeItem('isAdminAuthenticated');
    await signOut(auth);
    router.push('/');
  };

  const resetForms = () => {
    setProjectForm({ title: '', shortDescription: '', fullDescription: '', images: [''], tags: '', github: '', live: '', order: '0' });
    setCertForm({ name: '', issuer: '', date: '', image: '', link: '', techLearned: '', order: '0' });
    setBadgeForm({ name: '', issuer: '', explanation: '', image: '', link: '', order: '0' });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...projectForm,
      images: projectForm.images.filter(img => img.trim() !== ''),
      tags: projectForm.tags.split(',').map(t => t.trim()).filter(t => t !== ''),
      order: parseInt(projectForm.order) || 0
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, 'projects', editingId), data);
      } else {
        await addDoc(collection(db, 'projects'), data);
      }
      resetForms();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'projects');
    }
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...certForm,
      techLearned: certForm.techLearned.split(',').map(t => t.trim()).filter(t => t !== ''),
      order: parseInt(certForm.order) || 0
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, 'certifications', editingId), data);
      } else {
        await addDoc(collection(db, 'certifications'), data);
      }
      resetForms();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'certifications');
    }
  };

  const handleBadgeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...badgeForm,
      order: parseInt(badgeForm.order) || 0
    };
    try {
      if (editingId) {
        await updateDoc(doc(db, 'badges', editingId), data);
      } else {
        await addDoc(collection(db, 'badges'), data);
      }
      resetForms();
    } catch (error) {
      handleFirestoreError(error, editingId ? OperationType.UPDATE : OperationType.CREATE, 'badges');
    }
  };

  const handleDelete = async (id: string, type: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteDoc(doc(db, type, id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, type);
      }
    }
  };

  const openEdit = (item: Project | Certification | Badge, type: 'projects' | 'certifications' | 'badges') => {
    setEditingId(item.id);
    if (type === 'projects') {
      const project = item as Project;
      setProjectForm({
        title: project.title,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription,
        images: project.images.length > 0 ? project.images : [''],
        tags: project.tags.join(', '),
        github: project.github || '',
        live: project.live || '',
        order: (project.order || 0).toString()
      });
    } else if (type === 'certifications') {
      const cert = item as Certification;
      setCertForm({
        name: cert.name,
        issuer: cert.issuer,
        date: cert.date,
        image: cert.image,
        link: cert.link || '',
        techLearned: cert.techLearned ? cert.techLearned.join(', ') : '',
        order: (cert.order || 0).toString()
      });
    } else {
      const badge = item as Badge;
      setBadgeForm({
        name: badge.name,
        issuer: badge.issuer,
        explanation: badge.explanation,
        image: badge.image,
        link: badge.link,
        order: (badge.order || 0).toString()
      });
    }
    setIsModalOpen(true);
  };

  const handleAddImageUrl = () => {
    if (projectForm.images.length < 5) {
      setProjectForm({ ...projectForm, images: [...projectForm.images, ''] });
    }
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const newImages = [...projectForm.images];
    newImages[index] = value;
    setProjectForm({ ...projectForm, images: newImages });
  };

  if (isLoading) return <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">Loading...</div>;

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center text-white p-6">
        <div className="glass p-12 rounded-[40px] border border-white/10 text-center max-w-md">
          <div className="w-20 h-20 bg-neon-blue/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="text-neon-blue" size={40} />
          </div>
          <h1 className="text-3xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-gray-400 mb-8">Please use the hidden access in the navbar to enter the admin dashboard.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const isFirebaseAdmin = firebaseUser && firebaseUser.email === 'vpamudurti@gmail.com';

  const handleFirebaseLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Firebase login failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Firebase Auth Warning */}
        {!isFirebaseAdmin && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-3xl bg-red-500/10 border border-red-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-500/20 rounded-2xl">
                <ShieldCheck className="text-red-500" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-red-500">Firebase Authentication Required</h3>
                <p className="text-sm text-gray-400">You must be logged in with vpamudurti@gmail.com to save changes.</p>
              </div>
            </div>
            <button
              onClick={handleFirebaseLogin}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-all flex items-center space-x-2"
            >
              <LogIn size={18} />
              <span>Login with Google</span>
            </button>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage your portfolio content</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/50 transition-all text-gray-400 hover:text-red-500"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 px-6 py-2 rounded-xl bg-neon-blue text-black font-bold hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
            >
              <Plus size={18} />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-white/10">
          {[
            { id: 'projects', label: 'Projects', icon: Layout },
            { id: 'certifications', label: 'Certifications', icon: Award },
            { id: 'badges', label: 'Badges', icon: ShieldCheck },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'projects' | 'certifications' | 'badges')}
              className={`pb-4 px-4 flex items-center space-x-2 transition-all relative ${
                activeTab === tab.id ? 'text-neon-blue' : 'text-gray-500 hover:text-white'
              }`}
            >
              <tab.icon size={18} />
              <span className="font-bold">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-blue" />
              )}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === 'projects' && projects.map(project => (
            <div key={project.id} className="glass rounded-3xl overflow-hidden border border-white/10 group">
              <div className="relative h-48">
                <Image src={project.images[0] || 'https://picsum.photos/seed/placeholder/800/600'} alt={project.title} fill className="object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button onClick={() => openEdit(project, 'projects')} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(project.id, 'projects')} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{project.shortDescription}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-1 bg-white/5 rounded-full border border-white/10 text-gray-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'certifications' && certifications.map(cert => (
            <div key={cert.id} className="glass rounded-3xl overflow-hidden border border-white/10 group">
              <div className="relative h-48">
                <Image src={cert.image} alt={cert.name} fill className="object-cover" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button onClick={() => openEdit(cert, 'certifications')} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(cert.id, 'certifications')} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{cert.name}</h3>
                <p className="text-neon-blue text-sm mb-2">{cert.issuer}</p>
                <p className="text-gray-500 text-xs">{cert.date}</p>
              </div>
            </div>
          ))}

          {activeTab === 'badges' && badges.map(badge => (
            <div key={badge.id} className="glass rounded-3xl overflow-hidden border border-white/10 group">
              <div className="relative h-48 flex items-center justify-center bg-white/5">
                <div className="relative w-24 h-24">
                  <Image src={badge.image} alt={badge.name} fill className="object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button onClick={() => openEdit(badge, 'badges')} className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform">
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(badge.id, 'badges')} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-1">{badge.name}</h3>
                <p className="text-neon-purple text-sm mb-2">{badge.issuer}</p>
                <p className="text-gray-400 text-sm line-clamp-2">{badge.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass p-8 rounded-[40px] w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  {editingId ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}
                </h2>
                <button onClick={resetForms} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              {activeTab === 'projects' && (
                <form onSubmit={handleProjectSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Title</label>
                    <input
                      required
                      value={projectForm.title}
                      onChange={e => setProjectForm({...projectForm, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Short Description (Max 100 chars)</label>
                    <input
                      required
                      maxLength={100}
                      value={projectForm.shortDescription}
                      onChange={e => setProjectForm({...projectForm, shortDescription: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Full Description</label>
                    <textarea
                      required
                      rows={4}
                      value={projectForm.fullDescription}
                      onChange={e => setProjectForm({...projectForm, fullDescription: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-sm text-gray-400">Image URLs (Max 5)</label>
                      <button 
                        type="button" 
                        onClick={handleAddImageUrl} 
                        disabled={projectForm.images.length >= 5}
                        className="text-xs text-neon-blue hover:underline disabled:opacity-50"
                      >
                        + Add URL
                      </button>
                    </div>
                    {projectForm.images.map((url, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <ImageIcon size={16} className="text-gray-500" />
                        <input
                          required
                          value={url}
                          onChange={e => handleImageUrlChange(idx, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:border-neon-blue outline-none text-sm"
                          placeholder={`Image URL ${idx + 1}`}
                        />
                        {projectForm.images.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => setProjectForm({...projectForm, images: projectForm.images.filter((_, i) => i !== idx)})}
                            className="text-red-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Tags (comma separated)</label>
                    <input
                      required
                      value={projectForm.tags}
                      onChange={e => setProjectForm({...projectForm, tags: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      placeholder="React, Next.js, Tailwind"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">GitHub URL</label>
                      <input
                        value={projectForm.github}
                        onChange={e => setProjectForm({...projectForm, github: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Live Demo URL</label>
                      <input
                        value={projectForm.live}
                        onChange={e => setProjectForm({...projectForm, live: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Order (Priority)</label>
                      <input
                        type="number"
                        value={projectForm.order}
                        onChange={e => setProjectForm({...projectForm, order: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-neon-blue text-black font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all flex items-center justify-center space-x-2">
                    <Save size={20} />
                    <span>Save Project</span>
                  </button>
                </form>
              )}

              {activeTab === 'certifications' && (
                <form onSubmit={handleCertSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Certification Name</label>
                    <input
                      required
                      value={certForm.name}
                      onChange={e => setCertForm({...certForm, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Issuer</label>
                      <input
                        required
                        value={certForm.issuer}
                        onChange={e => setCertForm({...certForm, issuer: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Date</label>
                      <input
                        required
                        value={certForm.date}
                        onChange={e => setCertForm({...certForm, date: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                        placeholder="Jan 2024"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Technologies Learned (comma separated)</label>
                    <input
                      value={certForm.techLearned}
                      onChange={e => setCertForm({...certForm, techLearned: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      placeholder="React, Firebase, Security"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Image URL</label>
                      <input
                        required
                        value={certForm.image}
                        onChange={e => setCertForm({...certForm, image: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Link (Optional)</label>
                      <input
                        value={certForm.link}
                        onChange={e => setCertForm({...certForm, link: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Order (Priority)</label>
                      <input
                        type="number"
                        value={certForm.order}
                        onChange={e => setCertForm({...certForm, order: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-neon-blue text-black font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all flex items-center justify-center space-x-2">
                    <Save size={20} />
                    <span>Save Certification</span>
                  </button>
                </form>
              )}

              {activeTab === 'badges' && (
                <form onSubmit={handleBadgeSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Badge Name</label>
                      <input
                        required
                        value={badgeForm.name}
                        onChange={e => setBadgeForm({...badgeForm, name: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Issuer</label>
                      <input
                        required
                        value={badgeForm.issuer}
                        onChange={e => setBadgeForm({...badgeForm, issuer: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                        placeholder="GitHub, LeetCode"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Explanation</label>
                    <textarea
                      required
                      rows={3}
                      value={badgeForm.explanation}
                      onChange={e => setBadgeForm({...badgeForm, explanation: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Image URL</label>
                      <input
                        required
                        value={badgeForm.image}
                        onChange={e => setBadgeForm({...badgeForm, image: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Badge Link</label>
                      <input
                        required
                        value={badgeForm.link}
                        onChange={e => setBadgeForm({...badgeForm, link: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Order (Priority)</label>
                      <input
                        type="number"
                        value={badgeForm.order}
                        onChange={e => setBadgeForm({...badgeForm, order: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-neon-blue outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-neon-blue text-black font-bold rounded-2xl hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] transition-all flex items-center justify-center space-x-2">
                    <Save size={20} />
                    <span>Save Badge</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
