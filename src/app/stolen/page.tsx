'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import {
  House,
  Package,
  WarningOctagon,
  Plus,
  MagnifyingGlass,
  MapPin,
  TShirt
} from '@phosphor-icons/react';
import { db } from '@/lib/firebase';
import type { StolenItem, ItemStatus, StolenItemFormData, ItemUpdate } from '@/types/stolen-item';

export default function StolenItemsPage() {
  const [items, setItems] = useState<StolenItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'all'>('all');

  const [formData, setFormData] = useState<StolenItemFormData>({
    description: '',
    type: 'package',
    location: ''
  });
  
  useEffect(() => {
    try {
      const q = query(
        collection(db, 'stolen-items'),
        orderBy('dateReported', 'desc')
      );
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const newItems = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              dateReported: data.dateReported?.toDate(),
              lastSeen: data.lastSeen?.toDate(),
              updates: data.updates?.map((update: Omit<ItemUpdate, 'date'> & { date: Timestamp }) => ({
                ...update,
                date: update.date.toDate()
              }))
            } as StolenItem;
          });
          setItems(newItems);
          setError(null);
        },
        (error) => {
          console.error('Firestore error:', error);
          setError('Failed to load items. Please try again later.');
        }
      );
      return () => {
        unsubscribe();
      };
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to set up item loading. Please try again later.');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await addDoc(collection(db, 'stolen-items'), {
        ...formData,
        dateReported: serverTimestamp(),
        status: 'stolen' as ItemStatus,
        updates: []
      });
      setFormData({
        description: '',
        type: 'package',
        location: ''
      });
      setShowForm(false);
      setError(null);
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to report item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (itemId: string, newStatus: ItemStatus) => {
    try {
      const itemRef = doc(db, 'stolen-items', itemId);
      // Get current item data
      const currentItem = items.find(item => item.id === itemId);
      if (!currentItem) throw new Error('Item not found');

      await updateDoc(itemRef, {
        status: newStatus,
        lastUpdated: serverTimestamp(),
        updates: [...(currentItem.updates || []), {
          date: new Date(),
          text: `Status updated to: ${newStatus}`,
          status: newStatus
        }]
      });
      setError(null);
    } catch (error) {
      console.error('Error updating status:', error);
      setError('Failed to update status. Please try again.');
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.shipper && item.shipper.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    console.log('Filtering item:', {
      itemStatus: item.status,
      filterStatus: statusFilter,
      matches: statusFilter === 'all' || item.status === statusFilter
    });
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Debug logging for status filter changes
  useEffect(() => {
    console.log('Status filter changed to:', statusFilter);
  }, [statusFilter]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 backdrop-blur-lg bg-blue-900/80 border-b border-white/10"
      >
        <div className="container mx-auto px-4">
          <div className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <House size={24} weight="light" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  <WarningOctagon size={24} weight="light" className="text-red-400" />
                  Lost &amp; Found / Stolen Items
                </h1>
                <p className="text-sm text-white/60">
                  Track missing items at Witelli (No cameras allowed - WOKO policy)
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors"
            >
              <Plus size={20} weight="bold" />
              Report Missing Item
            </button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {/* Quick Action Section */}
          {!showForm && (
            <div className="mb-6 p-6 bg-white/10 backdrop-blur-sm rounded-lg text-center">
              <h2 className="text-xl font-bold text-white mb-3">Missing Something?</h2>
              <p className="text-white/60 mb-4">
                Report missing packages or items to help track them and alert other residents.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-400 transition-colors mx-auto"
              >
                <Plus size={20} weight="bold" />
                Report a Missing Item
              </button>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Search and Filter */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlass
                size={20}
                weight="light"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search items..."
                className="w-full bg-white/10 text-white border border-white/20 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  console.log('Status filter changed:', e.target.value);
                  setStatusFilter(e.target.value as ItemStatus | 'all');
                }}
                className="appearance-none bg-white/10 text-white border border-white/20 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer hover:bg-white/20 transition-colors"
                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
              >
                <option value="all" className="bg-blue-900">All Status</option>
                <option value="stolen" className="bg-blue-900">Missing/Stolen</option>
                <option value="found" className="bg-blue-900">Found</option>
                <option value="resolved" className="bg-blue-900">Resolved</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white/40">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Report Form */}
          {showForm && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Report Missing/Stolen Item</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/60 mb-1">Item Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, type: e.target.value as 'package' | 'clothing' | 'other' }))
                      }
                      className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    >
                      <option value="package" className="bg-blue-900">Package</option>
                      <option value="clothing" className="bg-blue-900">Clothing</option>
                      <option value="other" className="bg-blue-900">Other Item</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder={formData.type === 'package' ? 'Package description, size, contents if known...' : 'Item description, identifying features...'}
                      className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      rows={3}
                      required
                    />
                  </div>
                  {formData.type === 'package' && (
                    <div>
                      <label className="block text-white/60 mb-1">Shipper/Courier</label>
                      <input
                        type="text"
                        value={formData.shipper || ''}
                        onChange={(e) => setFormData((prev) => ({ ...prev, shipper: e.target.value }))}
                        placeholder="DHL, Post, etc."
                        className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-white/60 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="Where it was last seen"
                      className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Contact Info (Optional)</label>
                    <input
                      type="text"
                      value={formData.contactInfo || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, contactInfo: e.target.value }))}
                      placeholder="How to contact you if found"
                      className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 mb-1">Additional Details (Optional)</label>
                    <textarea
                      value={formData.additionalDetails || ''}
                      onChange={(e) => setFormData((prev) => ({ ...prev, additionalDetails: e.target.value }))}
                      placeholder="Any other relevant information..."
                      className="w-full bg-white/5 text-white border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-white/60 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-2 rounded-lg text-white font-medium ${
                      isSubmitting ? 'bg-red-500/50 cursor-not-allowed' : 'bg-red-500 hover:bg-red-400 transition-colors'
                    }`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Items List */}
          <div className="space-y-4">
            {filteredItems.map((item: StolenItem) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    {item.type === 'clothing' ? (
                      <TShirt size={24} weight="light" className="text-white/60 mt-1" />
                    ) : item.type === 'package' ? (
                      <Package size={24} weight="light" className="text-white/60 mt-1" />
                    ) : (
                      <WarningOctagon size={24} weight="light" className="text-white/60 mt-1" />
                    )}
                    <div>
                      <p className="text-white/90 font-medium">{item.description}</p>
                      {item.shipper && (
                        <p className="text-white/60 text-sm mt-1">
                          Shipper: {item.shipper}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-1 text-sm text-white/40">
                        <MapPin size={16} weight="light" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'stolen'
                        ? 'bg-red-500/20 text-red-300'
                        : item.status === 'found'
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                    {item.status === 'stolen' && (
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'found')}
                        className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded hover:bg-green-500/30"
                      >
                        Mark as Found
                      </button>
                    )}
                    {item.status === 'found' && (
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'resolved')}
                        className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded hover:bg-blue-500/30"
                      >
                        Mark as Resolved
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3 text-sm text-white/40">
                  <p>Reported: {item.dateReported ? item.dateReported.toLocaleDateString() : 'Loading...'}</p>
                  {item.contactInfo && <p className="mt-1">Contact: {item.contactInfo}</p>}
                  {item.additionalDetails && <p className="mt-2 text-white/60">{item.additionalDetails}</p>}
                </div>
              </motion.div>
            ))}
            {filteredItems.length === 0 && !error && (
              <div className="text-center py-12 text-white/40">
                No items reported in this category.
              </div>
            )}
          </div>
        </div>
      </div>

    </motion.main>
  );
}
