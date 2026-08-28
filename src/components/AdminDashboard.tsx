"use client";

import React, { useState, useMemo } from "react";
import { Users, Calendar, CreditCard, FileText, Plus, Edit2, Trash2, X, AlertCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  companyName: string | null;
  businessSector: string | null;
  role: string;
  passwordHash: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  price: number;
  maxParticipants: number | null;
  imageUrl: string | null;
  published: boolean;
}

interface Registration {
  id: string;
  userId: string;
  eventId: string;
  status: string;
  molliePaymentId: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

interface Document {
  id: string;
  title: string;
  fileUrl: string;
  category: string;
  uploadedAt: string;
}

interface AdminDashboardProps {
  initialUsers: User[];
  initialEvents: Event[];
  initialRegistrations: Registration[];
  initialDocuments: Document[];
}

export default function AdminDashboard({
  initialUsers,
  initialEvents,
  initialRegistrations,
  initialDocuments,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("members");

  // State lists
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [registrations] = useState<Registration[]>(initialRegistrations);
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  // Forms error/success states
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal / Form States
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    businessSector: "",
    role: "MEMBER",
  });

  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "18:00",
    endTime: "21:30",
    location: "",
    price: "0.00",
    maxParticipants: "",
    imageUrl: "",
    published: true,
  });

  const [showDocModal, setShowDocModal] = useState(false);
  const [docForm, setDocForm] = useState({
    title: "",
    fileUrl: "",
    category: "MINUTES",
  });

  // Selected event for registrations view
  const [selectedRegEventId, setSelectedRegEventId] = useState(initialEvents[0]?.id || "");

  // Clear notices
  const clearAlerts = () => {
    setFormError("");
    setFormSuccess("");
  };

  // --- MEMBER OPERATIONS ---
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      name: "",
      email: "",
      password: "",
      companyName: "",
      businessSector: "",
      role: "MEMBER",
    });
    clearAlerts();
    setShowMemberModal(true);
  };

  const handleOpenEditMember = (member: User) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      email: member.email,
      password: "", // do not fill password field for security
      companyName: member.companyName || "",
      businessSector: member.businessSector || "",
      role: member.role,
    });
    clearAlerts();
    setShowMemberModal(true);
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const isEdit = !!editingMember;
      const url = "/api/admin/members";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit ? { id: editingMember.id, ...memberForm } : memberForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setFormSuccess(isEdit ? "Lid succesvol bijgewerkt." : "Nieuw lid succesvol toegevoegd!");
        
        // Refresh local state lists
        if (isEdit) {
          setUsers(users.map((u) => (u.id === editingMember.id ? data.user : u)));
        } else {
          setUsers([...users, data.user].sort((a, b) => a.name.localeCompare(b.name)));
        }
        
        setTimeout(() => setShowMemberModal(false), 800);
      } else {
        setFormError(data.error || "Fout bij opslaan van lid.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Verbinding verbroken.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit lid wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) return;
    
    try {
      const res = await fetch(`/api/admin/members?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.id !== id));
      } else {
        alert("Fout bij het verwijderen van lid.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- EVENT OPERATIONS ---
  const handleOpenAddEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      description: "",
      date: "",
      startTime: "18:00",
      endTime: "21:30",
      location: "",
      price: "0.00",
      maxParticipants: "",
      imageUrl: "",
      published: true,
    });
    clearAlerts();
    setShowEventModal(true);
  };

  const handleOpenEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: new Date(event.date).toISOString().split("T")[0],
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.location,
      price: event.price.toString(),
      maxParticipants: event.maxParticipants?.toString() || "",
      imageUrl: event.imageUrl || "",
      published: event.published,
    });
    clearAlerts();
    setShowEventModal(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const isEdit = !!editingEvent;
      const url = "/api/admin/events";
      const method = isEdit ? "PUT" : "POST";
      const payload = isEdit ? { id: editingEvent.id, ...eventForm } : eventForm;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setFormSuccess(isEdit ? "Bijeenkomst succesvol bijgewerkt." : "Nieuwe bijeenkomst gecreëerd!");
        
        if (isEdit) {
          setEvents(events.map((ev) => (ev.id === editingEvent.id ? data.event : ev)));
        } else {
          setEvents([data.event, ...events]);
        }
        
        setTimeout(() => setShowEventModal(false), 800);
      } else {
        setFormError(data.error || "Fout bij opslaan van bijeenkomst.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Verbinding verbroken.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze bijeenkomst wilt verwijderen?")) return;
    
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(events.filter((ev) => ev.id !== id));
      } else {
        alert("Fout bij het verwijderen van bijeenkomst.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- DOCUMENT OPERATIONS ---
  const handleSaveDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");
    setFormSuccess("");

    try {
      const res = await fetch("/api/admin/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(docForm),
      });

      const data = await res.json();

      if (res.ok) {
        setFormSuccess("Document succesvol geüpload!");
        setDocuments([data.document, ...documents]);
        setDocForm({ title: "", fileUrl: "", category: "MINUTES" });
        setTimeout(() => setShowDocModal(false), 800);
      } else {
        setFormError(data.error || "Fout bij opslaan van document.");
      }
    } catch (err) {
      console.error(err);
      setFormError("Verbinding verbroken.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteDoc = async (id: string) => {
    if (!confirm("Weet je zeker dat je dit document wilt verwijderen?")) return;
    
    try {
      const res = await fetch(`/api/admin/documents?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setDocuments(documents.filter((doc) => doc.id !== id));
      } else {
        alert("Fout bij het verwijderen van document.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter registrations for the selected event
  const selectedRegistrations = useMemo(() => {
    return registrations.filter((r) => r.eventId === selectedRegEventId);
  }, [registrations, selectedRegEventId]);

  return (
    <div className="bg-gray-50 flex-grow min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar Navigation */}
          <div className="w-full lg:w-64 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm shrink-0 h-fit space-y-2">
            <div className="mb-6 pl-2">
              <h2 className="font-display text-lg font-bold text-uvon-purple">Admin Beheer</h2>
              <p className="text-xs text-gray-400 mt-0.5">UVON Noord-Brabant</p>
            </div>
            
            <button
              onClick={() => setActiveTab("members")}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "members"
                  ? "bg-uvon-purple text-white shadow-sm"
                  : "text-gray-600 hover:bg-uvon-light hover:text-uvon-purple"
              }`}
            >
              <Users className="h-4.5 w-4.5 mr-3" />
              Ledenbeheer
            </button>
            
            <button
              onClick={() => setActiveTab("events")}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "events"
                  ? "bg-uvon-purple text-white shadow-sm"
                  : "text-gray-600 hover:bg-uvon-light hover:text-uvon-purple"
              }`}
            >
              <Calendar className="h-4.5 w-4.5 mr-3" />
              Bijeenkomsten
            </button>
            
            <button
              onClick={() => setActiveTab("registrations")}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "registrations"
                  ? "bg-uvon-purple text-white shadow-sm"
                  : "text-gray-600 hover:bg-uvon-light hover:text-uvon-purple"
              }`}
            >
              <CreditCard className="h-4.5 w-4.5 mr-3" />
              Inschrijvingen
            </button>
            
            <button
              onClick={() => setActiveTab("documents")}
              className={`w-full flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                activeTab === "documents"
                  ? "bg-uvon-purple text-white shadow-sm"
                  : "text-gray-600 hover:bg-uvon-light hover:text-uvon-purple"
              }`}
            >
              <FileText className="h-4.5 w-4.5 mr-3" />
              Documenten / Notulen
            </button>
          </div>

          {/* Main Content Pane */}
          <div className="flex-grow bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm min-w-0">
            
            {/* 1. MEMBERS TAB */}
            {activeTab === "members" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-display text-xl font-bold text-uvon-purple">Leden & Gebruikers</h3>
                    <p className="text-xs text-gray-500 mt-1">Ledenadministratie, goedkeuringen en roltoewijzingen.</p>
                  </div>
                  <button
                    onClick={handleOpenAddMember}
                    className="inline-flex items-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl shadow transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Lid Toevoegen
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 rounded-l-xl">Naam</th>
                        <th className="px-6 py-4">E-mail</th>
                        <th className="px-6 py-4">Bedrijf</th>
                        <th className="px-6 py-4">Sector</th>
                        <th className="px-6 py-4">Status / Rol</th>
                        <th className="px-6 py-4 rounded-r-xl text-right">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((user) => {
                        const isPending = user.passwordHash === "DEACTIVATED_PENDING_APPROVAL";
                        return (
                          <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-800">{user.name}</td>
                            <td className="px-6 py-4">{user.email}</td>
                            <td className="px-6 py-4">{user.companyName || "-"}</td>
                            <td className="px-6 py-4">{user.businessSector || "-"}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  isPending
                                    ? "bg-amber-50 text-amber-700 border border-amber-100"
                                    : user.role === "ADMIN"
                                    ? "bg-purple-50 text-purple-700 border border-purple-100"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                }`}
                              >
                                {isPending ? "Wacht op goedkeuring" : user.role === "ADMIN" ? "Bestuur / Admin" : "Actief Lid"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditMember(user)}
                                className="p-2 text-gray-400 hover:text-uvon-purple hover:bg-uvon-light rounded-lg transition-colors inline-block"
                                title={isPending ? "Goedkeuren / Activeren" : "Profiel bewerken"}
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMember(user.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                title="Verwijderen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. EVENTS TAB */}
            {activeTab === "events" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-display text-xl font-bold text-uvon-purple">Bijeenkomsten & Agenda</h3>
                    <p className="text-xs text-gray-500 mt-1">Creëer en wijzig bijeenkomsten en evenementen.</p>
                  </div>
                  <button
                    onClick={handleOpenAddEvent}
                    className="inline-flex items-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl shadow transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Bijeenkomst Toevoegen
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 rounded-l-xl">Bijeenkomst</th>
                        <th className="px-6 py-4">Datum</th>
                        <th className="px-6 py-4">Tijd</th>
                        <th className="px-6 py-4">Locatie</th>
                        <th className="px-6 py-4">Prijs</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 rounded-r-xl text-right">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {events.map((event) => {
                        const dateFormatted = new Date(event.date).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });
                        return (
                          <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-800 line-clamp-1 max-w-[200px]" title={event.title}>
                              {event.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{dateFormatted}</td>
                            <td className="px-6 py-4 whitespace-nowrap">{event.startTime} - {event.endTime}</td>
                            <td className="px-6 py-4 line-clamp-1 max-w-[150px]" title={event.location}>{event.location}</td>
                            <td className="px-6 py-4 font-semibold text-purple-950">€ {event.price.toFixed(2)}</td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  event.published
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                    : "bg-gray-50 text-gray-500 border border-gray-100"
                                }`}
                              >
                                {event.published ? "Gepubliceerd" : "Ontwerp"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenEditEvent(event)}
                                className="p-2 text-gray-400 hover:text-uvon-purple hover:bg-uvon-light rounded-lg transition-colors inline-block"
                                title="Bijeenkomst bewerken"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                title="Verwijderen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. REGISTRATIONS TAB */}
            {activeTab === "registrations" && (
              <div className="space-y-6">
                <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-display text-xl font-bold text-uvon-purple">Registraties & Mollie Betalingen</h3>
                    <p className="text-xs text-gray-500 mt-1">Overzicht van inschrijvingen en Mollie betaalstatussen.</p>
                  </div>
                  
                  {/* Select Event dropdown */}
                  <div className="w-full sm:w-64">
                    <select
                      value={selectedRegEventId}
                      onChange={(e) => setSelectedRegEventId(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-xs sm:text-sm bg-gray-50/50 cursor-pointer"
                    >
                      {events.map((ev) => (
                        <option key={ev.id} value={ev.id}>
                          {ev.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedRegistrations.length === 0 ? (
                  <div className="p-12 text-center bg-gray-50 rounded-2xl border border-gray-100">
                    <CreditCard className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm text-gray-500">Er zijn nog geen registraties geplaatst voor deze bijeenkomst.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-4 rounded-l-xl">Deelnemer</th>
                          <th className="px-6 py-4">E-mail</th>
                          <th className="px-6 py-4">Aangemeld op</th>
                          <th className="px-6 py-4">Mollie Betaling ID</th>
                          <th className="px-6 py-4 rounded-r-xl">Betaalstatus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedRegistrations.map((reg) => {
                          const dateFormatted = new Date(reg.createdAt).toLocaleDateString("nl-NL", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          });
                          return (
                            <tr key={reg.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4 font-semibold text-gray-800">{reg.user.name}</td>
                              <td className="px-6 py-4">{reg.user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap">{dateFormatted}</td>
                              <td className="px-6 py-4 font-mono text-xs text-gray-400">{reg.molliePaymentId || "Geen (Gratis)"}</td>
                              <td className="px-6 py-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                    reg.status === "PAID"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                      : reg.status === "PENDING"
                                      ? "bg-amber-50 text-amber-700 border border-amber-100"
                                      : "bg-red-50 text-red-700 border border-red-100"
                                  }`}
                                >
                                  {reg.status === "PAID" ? "Betaald" : reg.status === "PENDING" ? "In afwachting" : "Mislukt"}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. DOCUMENTS TAB */}
            {activeTab === "documents" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-display text-xl font-bold text-uvon-purple">Documenten & Notulen</h3>
                    <p className="text-xs text-gray-500 mt-1">Upload en beheer interne bestanden en ALV-verslagen.</p>
                  </div>
                  <button
                    onClick={() => {
                      setDocForm({ title: "", fileUrl: "", category: "MINUTES" });
                      clearAlerts();
                      setShowDocModal(true);
                    }}
                    className="inline-flex items-center px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl shadow transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-1.5" />
                    Document Toevoegen
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 rounded-l-xl">Document Titel</th>
                        <th className="px-6 py-4">Categorie</th>
                        <th className="px-6 py-4">Bestands-link / URL</th>
                        <th className="px-6 py-4">Toegevoegd op</th>
                        <th className="px-6 py-4 rounded-r-xl text-right">Acties</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {documents.map((doc) => {
                        const dateFormatted = new Date(doc.uploadedAt).toLocaleDateString("nl-NL", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        });
                        return (
                          <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-800">{doc.title}</td>
                            <td className="px-6 py-4">
                              <span className="text-xs font-semibold text-uvon-purple bg-uvon-light px-2.5 py-1 rounded-full">
                                {doc.category === "MINUTES" ? "Notulen" : doc.category === "FINANCIAL" ? "Financieel" : "Overig"}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-uvon-accent select-all hover:underline leading-relaxed max-w-[200px] truncate" title={doc.fileUrl}>
                              {doc.fileUrl}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">{dateFormatted}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors inline-block"
                                title="Verwijderen"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- MEMBER MODAL --- */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 border border-gray-100 shadow-xl relative overflow-hidden space-y-6">
            <button
              onClick={() => setShowMemberModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-display text-lg font-bold text-uvon-purple">
                {editingMember ? "Lid Bewerken" : "Nieuw Lid Toevoegen"}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Vul de gegevens van de ondernemer in.</p>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Volledige Naam *</label>
                  <input
                    type="text"
                    required
                    value={memberForm.name}
                    onChange={(e) => setMemberForm({ ...memberForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">E-mailadres *</label>
                  <input
                    type="email"
                    required
                    value={memberForm.email}
                    onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    {editingMember ? "Nieuw Wachtwoord (optioneel)" : "Wachtwoord *"}
                  </label>
                  <input
                    type="password"
                    required={!editingMember}
                    value={memberForm.password}
                    onChange={(e) => setMemberForm({ ...memberForm, password: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Rol</label>
                  <select
                    value={memberForm.role}
                    onChange={(e) => setMemberForm({ ...memberForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm cursor-pointer"
                  >
                    <option value="MEMBER">Gewoon Lid (MEMBER)</option>
                    <option value="ADMIN">Bestuurder (ADMIN)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Bedrijfsnaam</label>
                  <input
                    type="text"
                    value={memberForm.companyName}
                    onChange={(e) => setMemberForm({ ...memberForm, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Branche / Sector</label>
                  <input
                    type="text"
                    value={memberForm.businessSector}
                    onChange={(e) => setMemberForm({ ...memberForm, businessSector: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl transition-all shadow-sm"
                >
                  {isSubmitting ? "Opslaan..." : "Opslaan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EVENT MODAL --- */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 border border-gray-100 shadow-xl relative overflow-hidden space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-display text-lg font-bold text-uvon-purple">
                {editingEvent ? "Bijeenkomst Bewerken" : "Nieuwe Bijeenkomst"}
              </h3>
              <p className="text-xs text-gray-400 mt-1">Vul de details van de bijeenkomst in.</p>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Titel van de bijeenkomst *</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Programma / Omschrijving *</label>
                <textarea
                  required
                  rows={4}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Datum *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Starttijd *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.startTime}
                    onChange={(e) => setEventForm({ ...eventForm, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Eindtijd *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.endTime}
                    onChange={(e) => setEventForm({ ...eventForm, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Locatie *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Prijs (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={eventForm.price}
                    onChange={(e) => setEventForm({ ...eventForm, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Max Deelnemers</label>
                  <input
                    type="number"
                    value={eventForm.maxParticipants}
                    onChange={(e) => setEventForm({ ...eventForm, maxParticipants: e.target.value })}
                    placeholder="Bijv. 40"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Afbeelding URL</label>
                  <input
                    type="url"
                    value={eventForm.imageUrl}
                    onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                  <div className="flex items-center h-10">
                    <input
                      type="checkbox"
                      id="published"
                      checked={eventForm.published}
                      onChange={(e) => setEventForm({ ...eventForm, published: e.target.checked })}
                      className="h-4 w-4 text-uvon-purple border-gray-300 rounded focus:ring-uvon-purple/20"
                    />
                    <label htmlFor="published" className="ml-2 text-sm text-gray-700 font-semibold cursor-pointer">
                      Direct publiceren
                    </label>
                  </div>
                </div>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl transition-all shadow-sm"
                >
                  {isSubmitting ? "Opslaan..." : "Opslaan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- DOCUMENT MODAL --- */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 border border-gray-100 shadow-xl relative overflow-hidden space-y-6">
            <button
              onClick={() => setShowDocModal(false)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <h3 className="font-display text-lg font-bold text-uvon-purple">Nieuw Document Toevoegen</h3>
              <p className="text-xs text-gray-400 mt-1">Voeg notulen of financiële jaarstukken toe voor leden.</p>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Document Titel *</label>
                <input
                  type="text"
                  required
                  value={docForm.title}
                  onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
                  placeholder="Bijv. Notulen ALV Juni 2026"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Document URL / Bestands-link *</label>
                <input
                  type="text"
                  required
                  value={docForm.fileUrl}
                  onChange={(e) => setDocForm({ ...docForm, fileUrl: e.target.value })}
                  placeholder="Bijv. /documents/notulen_juni_2026.pdf"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Categorie</label>
                <select
                  value={docForm.category}
                  onChange={(e) => setDocForm({ ...docForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-uvon-purple/20 text-sm cursor-pointer"
                >
                  <option value="MINUTES">Notulen / Verslagen (MINUTES)</option>
                  <option value="FINANCIAL">Financieel / Jaarcijfers (FINANCIAL)</option>
                  <option value="OTHER">Overige Documenten (OTHER)</option>
                </select>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 text-red-800 border border-red-100 rounded-xl flex items-start gap-2 text-xs">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-xl flex items-start gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold text-white bg-uvon-purple hover:bg-uvon-accent rounded-xl transition-all shadow-sm"
                >
                  {isSubmitting ? "Opslaan..." : "Toevoegen"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
