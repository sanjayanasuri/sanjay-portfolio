"use client";
import React from "react";
import { useEffect, useState } from "react";

type Meta = { clubs: any[]; rooms: any[]; students: any[] };

export default function MeetingsPage() {
  const [meta, setMeta] = useState<Meta>({ clubs: [], rooms: [], students: [] });
  const [rows, setRows] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [form, setForm] = useState<any>({
    date: "", time: "", duration_minutes: 60,
    club_id: "", room_id: "", invited_count: 0, accepted_count: 0, organizer_ids: []
  });

  const load = async () => {
    try {
      setLoading(true);
      const [m, data] = await Promise.all([
        fetch("/api/filters/meta").then(r => r.json()),
        fetch("/api/meetings").then(r => r.json())
      ]);
      setMeta(m);
      setRows(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setForm({ date:"", time:"", duration_minutes:60, club_id:"", room_id:"", invited_count:0, accepted_count:0, organizer_ids:[] });
    setEditingId(null);
    setMessage(null);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      let response;
      if (editingId) {
        response = await fetch(`/api/meetings/${editingId}`, { 
          method: "PUT", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify(form) 
        });
      } else {
        response = await fetch("/api/meetings", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify(form) 
        });
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save meeting');
      }
      
      setMessage({ 
        type: 'success', 
        text: editingId ? 'Meeting updated successfully!' : 'Meeting created successfully!' 
      });
      resetForm();
      await load();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Save error:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to save meeting. Please check all required fields.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const edit = (meeting: any) => {
    setEditingId(meeting.id);
    setForm({
      date: meeting.date?.slice(0, 10) || "",
      time: meeting.time || "",
      duration_minutes: meeting.duration_minutes || 60,
      club_id: meeting.club_id || "",
      room_id: meeting.room_id || "",
      invited_count: meeting.invited_count || 0,
      accepted_count: meeting.accepted_count || 0,
      organizer_ids: meeting.organizers?.map((o: any) => o.student_id) || []
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const remove = async (id: number) => {
    try {
      const response = await fetch(`/api/meetings/${id}`, { method: "DELETE" });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete meeting');
      }
      
      setMessage({ type: 'success', text: 'Meeting deleted successfully!' });
      setDeleteConfirm(null);
      await load();
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      console.error('Delete error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to delete meeting' });
      setDeleteConfirm(null);
    }
  };

  const attendanceRate = (invited: number, accepted: number) => {
    return invited > 0 ? ((accepted / invited) * 100).toFixed(1) : '0';
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-zinc-900 mb-2">Meetings Management</h1>
          <p className="text-zinc-600">Create, update, and manage club meetings</p>
        </div>
        <a href="/reports/meetings" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
          View Reports →
        </a>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>What is this?</strong> This system manages club meetings by tracking when and where they occur, 
          which clubs organize them, attendance (invited vs accepted), and student organizers. 
          All data is stored in a relational database with proper relationships between clubs, rooms, students, and meetings.
        </p>
      </div>

      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-zinc-900 mb-4">
          {editingId ? 'Edit Meeting' : 'Create New Meeting'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Date *</label>
            <input 
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent" 
              required 
              type="date"
              value={form.date} 
              onChange={e=>setForm({...form, date:e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Time *</label>
            <input 
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent" 
              required 
              placeholder="18:00"
              value={form.time} 
              onChange={e=>setForm({...form, time:e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Duration (minutes)</label>
            <input 
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent" 
              type="number" 
              placeholder="60"
              value={form.duration_minutes} 
              onChange={e=>setForm({...form, duration_minutes:+e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Club *</label>
            <select 
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent" 
              required
              value={form.club_id} 
              onChange={e=>setForm({...form, club_id:+e.target.value})}
            >
              <option value="">Select club</option>
              {meta.clubs.map((c:any)=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Room *</label>
            <select 
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent" 
              required
              value={form.room_id} 
              onChange={e=>setForm({...form, room_id:+e.target.value})}
            >
              <option value="">Select room</option>
              {meta.rooms.map((r:any)=><option key={r.id} value={r.id}>{r.building} {r.number}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Invited Count</label>
            <input 
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent" 
              type="number" 
              placeholder="0"
              value={form.invited_count} 
              onChange={e=>setForm({...form, invited_count:+e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-1">Accepted Count</label>
            <input 
              className="w-full border border-zinc-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent" 
              type="number" 
              placeholder="0"
              value={form.accepted_count} 
              onChange={e=>setForm({...form, accepted_count:+e.target.value})}
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button 
              type="submit" 
              disabled={submitting}
              className="flex-1 bg-zinc-900 text-white rounded-lg py-2.5 px-4 font-medium hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Meeting' : 'Create Meeting'}
            </button>
            {editingId && (
              <button 
                type="button" 
                onClick={resetForm} 
                className="px-6 bg-zinc-100 text-zinc-700 rounded-lg py-2.5 font-medium hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50">
          <h2 className="text-xl font-semibold text-zinc-900">All Meetings</h2>
          <p className="text-sm text-zinc-600 mt-1">Total: {rows.length} meeting{rows.length !== 1 ? 's' : ''}</p>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Loading meetings...</div>
        ) : rows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-zinc-500 mb-2">No meetings found</p>
            <p className="text-sm text-zinc-400">Create your first meeting using the form above</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-50 border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Club</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Room</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Invited</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Accepted</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-600 uppercase tracking-wider">Attendance</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-zinc-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {rows.map((r:any)=>(
                  <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-zinc-900">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700">{r.time}</td>
                    <td className="px-4 py-3 text-sm text-zinc-900 font-medium">{r.club?.name}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700">{r.room?.building} {r.room?.number}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700">{r.invited_count}</td>
                    <td className="px-4 py-3 text-sm text-zinc-700">{r.accepted_count}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(attendanceRate(r.invited_count, r.accepted_count)) >= 60 
                          ? 'bg-green-100 text-green-800' 
                          : parseFloat(attendanceRate(r.invited_count, r.accepted_count)) >= 40
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {attendanceRate(r.invited_count, r.accepted_count)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button 
                          onClick={()=>edit(r)} 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={()=>setDeleteConfirm(r.id)} 
                          className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-semibold text-zinc-900 mb-2">Confirm Delete</h3>
            <p className="text-zinc-600 mb-6">Are you sure you want to delete this meeting? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => remove(deleteConfirm)}
                className="flex-1 bg-red-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-zinc-100 text-zinc-700 rounded-lg py-2 px-4 font-medium hover:bg-zinc-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

