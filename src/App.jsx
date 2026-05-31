import React, { useState, useEffect, useMemo } from "react";
import {
  seedMembers, seedTrainers, seedClasses, seedPayments,
  seedProducts, seedSales, seedLeads, seedAccessLogs,
  seedMessages, seedTemplates, seedMemberStocks, seedDirectMessages,
  seedNotifications, seedWorkoutLogs, seedBodyMetrics, seedLoyaltyPoints,
  seedChallenges, seedShifts, seedEquipment, seedExpenses, seedVideos,
  seedClassRatings, seedProgressPhotos, seedWorkoutPlans,
  NAV_BY_ROLE,
} from "./data/seed";
import { loadData, saveData, clearData } from "./utils/storage";
import { Sidebar, Header, BottomNav } from "./components/Layout";
import { LoginScreen } from "./views/LoginScreen";
import {
  Dashboard, MembersView, MemberDetail, ClassesView, TrainersView,
  CheckInsView, PaymentsView, AnalyticsView, MemberStocksView,
} from "./views/CoreViews";
import { POSView } from "./views/POSView";
import { LeadsView, AccessControlView, MessagesView } from "./views/PipelineViews";
import {
  TrainerHome, TrainerClasses, TrainerClients,
  MemberHome, MemberQRView, MemberBookClasses, MemberHistory, MemberPayments,
  MemberShop, MemberStock,
} from "./views/RoleViews";
import { ChatView } from "./views/MessagingViews";
import { WorkoutLogView, BodyMetricsView } from "./views/FitnessViews";
import { LoyaltyRewardsView, ReferralView, ChallengesView } from "./views/GrowthViews";
import { StaffShiftsView, EquipmentView, ExpensesView, VideoLibraryView } from "./views/OpsViews";
import { ProfileView } from "./views/ProfileView";
import { ProgressPhotosView, LeaderboardView, WorkoutPlanView, AssignPlanView } from "./views/NewMemberFeatures";

export default function App() {
  // ─── Auth ──────────────────────────────────────────────────────────────────
  const [user, setUser] = useState(() => loadData("session", null));

  // ─── Persistent state ──────────────────────────────────────────────────────
  const [members, setMembers] = useState(() => loadData("members", seedMembers));
  const [trainers, setTrainers] = useState(() => loadData("trainers", seedTrainers));
  const [classes, setClasses] = useState(() => loadData("classes", seedClasses));
  const [checkIns, setCheckIns] = useState(() => loadData("checkIns", []));
  const [payments, setPayments] = useState(() => loadData("payments", seedPayments));
  const [products, setProducts] = useState(() => loadData("products", seedProducts));
  const [sales, setSales] = useState(() => loadData("sales", seedSales));
  const [leads, setLeads] = useState(() => loadData("leads", seedLeads));
  const [accessLogs, setAccessLogs] = useState(() => loadData("accessLogs", seedAccessLogs));
  const [messages, setMessages] = useState(() => loadData("messages", seedMessages));
  const [templates, setTemplates] = useState(() => loadData("templates", seedTemplates));
  const [shopOrders, setShopOrders] = useState(() => loadData("shopOrders", []));
  const [memberStocks, setMemberStocks] = useState(() => loadData("memberStocks", seedMemberStocks));
  const [directMessages, setDirectMessages] = useState(() => loadData("directMessages", seedDirectMessages));
  const [notifications, setNotifications] = useState(() => loadData("notifications", seedNotifications));
  const [workoutLogs, setWorkoutLogs] = useState(() => loadData("workoutLogs", seedWorkoutLogs));
  const [bodyMetrics, setBodyMetrics] = useState(() => loadData("bodyMetrics", seedBodyMetrics));
  const [loyaltyPoints, setLoyaltyPoints] = useState(() => loadData("loyaltyPoints", seedLoyaltyPoints));
  const [challenges, setChallenges] = useState(() => loadData("challenges", seedChallenges));
  const [shifts, setShifts] = useState(() => loadData("shifts", seedShifts));
  const [equipment, setEquipment] = useState(() => loadData("equipment", seedEquipment));
  const [expenses, setExpenses] = useState(() => loadData("expenses", seedExpenses));
  const [videos, setVideos] = useState(() => loadData("videos", seedVideos));
  const [classRatings, setClassRatings] = useState(() => loadData("classRatings", seedClassRatings));
  const [progressPhotos, setProgressPhotos] = useState(() => loadData("progressPhotos", seedProgressPhotos));
  const [workoutPlans, setWorkoutPlans] = useState(() => loadData("workoutPlans", seedWorkoutPlans));

  // ─── UI state ──────────────────────────────────────────────────────────────
  const [view, setView] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // ─── Persistence effects ───────────────────────────────────────────────────
  useEffect(() => { saveData("members", members); }, [members]);
  useEffect(() => { saveData("trainers", trainers); }, [trainers]);
  useEffect(() => { saveData("classes", classes); }, [classes]);
  useEffect(() => { saveData("checkIns", checkIns); }, [checkIns]);
  useEffect(() => { saveData("payments", payments); }, [payments]);
  useEffect(() => { saveData("products", products); }, [products]);
  useEffect(() => { saveData("sales", sales); }, [sales]);
  useEffect(() => { saveData("leads", leads); }, [leads]);
  useEffect(() => { saveData("accessLogs", accessLogs); }, [accessLogs]);
  useEffect(() => { saveData("messages", messages); }, [messages]);
  useEffect(() => { saveData("templates", templates); }, [templates]);
  useEffect(() => { saveData("shopOrders", shopOrders); }, [shopOrders]);
  useEffect(() => { saveData("memberStocks", memberStocks); }, [memberStocks]);
  useEffect(() => { saveData("directMessages", directMessages); }, [directMessages]);
  useEffect(() => { saveData("notifications", notifications); }, [notifications]);
  useEffect(() => { saveData("workoutLogs", workoutLogs); }, [workoutLogs]);
  useEffect(() => { saveData("bodyMetrics", bodyMetrics); }, [bodyMetrics]);
  useEffect(() => { saveData("loyaltyPoints", loyaltyPoints); }, [loyaltyPoints]);
  useEffect(() => { saveData("challenges", challenges); }, [challenges]);
  useEffect(() => { saveData("shifts", shifts); }, [shifts]);
  useEffect(() => { saveData("equipment", equipment); }, [equipment]);
  useEffect(() => { saveData("expenses", expenses); }, [expenses]);
  useEffect(() => { saveData("videos", videos); }, [videos]);
  useEffect(() => { saveData("classRatings", classRatings); }, [classRatings]);
  useEffect(() => { saveData("progressPhotos", progressPhotos); }, [progressPhotos]);
  useEffect(() => { saveData("workoutPlans", workoutPlans); }, [workoutPlans]);

  // ─── Default view on login ─────────────────────────────────────────────────
  useEffect(() => {
    if (user && !view) setView(NAV_BY_ROLE[user.role][0]);
  }, [user, view]);

  // ─── Smart login notifications ─────────────────────────────────────────────
  const generateLoginNotifications = (account) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const newNotifs = [];

    // Admin/receptionist: expiring memberships
    if (account.role === "admin" || account.role === "receptionist") {
      const expiring = members.filter((m) => {
        if (m.status !== "active") return false;
        const days = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
        return days >= 0 && days <= 7;
      });
      if (expiring.length > 0) {
        newNotifs.push({
          id: `notif-exp-${Date.now()}`,
          userId: account.username,
          type: "payment",
          title: `${expiring.length} membership${expiring.length > 1 ? "s" : ""} expiring within 7 days`,
          body: expiring.map((m) => `${m.name} (${Math.ceil((new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))}d left)`).join(", "),
          timestamp: new Date().toISOString(),
          read: false,
        });
      }

      // Low stock alert for POS products
      const lowStock = products.filter((p) => p.lowStock > 0 && p.stock <= p.lowStock);
      if (lowStock.length > 0) {
        newNotifs.push({
          id: `notif-stock-${Date.now()}`,
          userId: account.username,
          type: "order",
          title: `${lowStock.length} product${lowStock.length > 1 ? "s" : ""} low on stock`,
          body: lowStock.slice(0, 3).map((p) => `${p.name}: ${p.stock} left`).join(" · "),
          timestamp: new Date().toISOString(),
          read: false,
        });
      }

      // Equipment needing attention
      const brokenEq = equipment.filter((e) => e.status !== "operational");
      if (brokenEq.length > 0) {
        newNotifs.push({
          id: `notif-eq-${Date.now()}`,
          userId: account.username,
          type: "order",
          title: `${brokenEq.length} equipment item${brokenEq.length > 1 ? "s" : ""} need attention`,
          body: brokenEq.map((e) => e.name).join(", "),
          timestamp: new Date().toISOString(),
          read: false,
        });
      }

      // Pending membership pause requests
      const pendingPauses = members.filter((m) => m.pauseRequest?.status === "pending");
      if (pendingPauses.length > 0) {
        newNotifs.push({
          id: `notif-pause-${Date.now()}`,
          userId: account.username,
          type: "payment",
          title: `${pendingPauses.length} membership hold request${pendingPauses.length > 1 ? "s" : ""} pending`,
          body: pendingPauses.map((m) => m.name).join(", "),
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }

    // Trainer: today's classes
    if (account.role === "trainer") {
      const todayDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
      const todayClasses = classes.filter((c) => c.trainerId === account.trainerId && c.day === todayDay);
      if (todayClasses.length > 0) {
        newNotifs.push({
          id: `notif-trainer-${Date.now()}`,
          userId: account.username,
          type: "class",
          title: `You have ${todayClasses.length} class${todayClasses.length > 1 ? "es" : ""} today`,
          body: todayClasses.map((c) => `${c.name} at ${c.time} (${c.booked}/${c.capacity} booked)`).join(" · "),
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }

    // Member: today's booked classes
    if (account.role === "member" && account.memberId) {
      const todayDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date().getDay()];
      const myTodayClasses = classes.filter((c) => (c.bookedMemberIds || []).includes(account.memberId) && c.day === todayDay);
      if (myTodayClasses.length > 0) {
        newNotifs.push({
          id: `notif-member-${Date.now()}`,
          userId: account.username,
          type: "class",
          title: `${myTodayClasses.length} class${myTodayClasses.length > 1 ? "es" : ""} today`,
          body: myTodayClasses.map((c) => `${c.name} at ${c.time}`).join(" · "),
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }

    if (newNotifs.length > 0) {
      setNotifications((ns) => [...newNotifs, ...ns]);
    }
  };

  // ─── Auth handlers ─────────────────────────────────────────────────────────
  const handleLogin = (account) => {
    saveData("session", account);
    setUser(account);
    setView(NAV_BY_ROLE[account.role][0]);
    generateLoginNotifications(account);
  };

  const handleLogout = () => {
    clearData("session");
    setUser(null);
    setView(null);
    setSelectedMember(null);
  };

  // ─── Dashboard stats ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = members.filter((m) => m.status === "active").length;
    const todayStr = new Date().toISOString().slice(0, 10);
    const currentMonth = todayStr.slice(0, 7);
    const revenue = payments.filter((p) => p.status === "paid" && p.date.slice(0, 7) === currentMonth).reduce((s, p) => s + p.amount, 0);
    const todayCheckIns = checkIns.filter((c) => c.date === todayStr).length;
    const classUtil = classes.length > 0 ? classes.reduce((s, c) => s + c.booked / c.capacity, 0) / classes.length : 0;
    const overdueCount = payments.filter((p) => p.status === "overdue").length;
    const expiringSoon = members.filter((m) => {
      if (m.status !== "active") return false;
      const days = (new Date(m.expiryDate) - new Date()) / (1000 * 60 * 60 * 24);
      return days >= 0 && days <= 14;
    }).length;
    return { active, revenue, todayCheckIns, classUtil, overdueCount, expiringSoon };
  }, [members, payments, checkIns, classes]);

  // ─── Not logged in ─────────────────────────────────────────────────────────
  if (!user) return <LoginScreen onLogin={handleLogin} />;

  // ─── Logged in ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-950 flex">
      <Sidebar
        view={view}
        setView={(v) => { setView(v); setSidebarOpen(false); }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        onLogout={handleLogout}
        onProfile={() => { setView("profile"); setSidebarOpen(false); }}
      />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header
          view={view}
          onMenuClick={() => setSidebarOpen(true)}
          user={user}
          notifications={notifications}
          setNotifications={setNotifications}
        />

        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 pb-24 lg:py-8 max-w-7xl w-full mx-auto">

          {/* ── ADMIN & RECEPTIONIST ───────────────────────────────────────── */}
          {view === "dashboard" && (
            <Dashboard stats={stats} members={members} classes={classes} payments={payments} onMemberClick={setSelectedMember} onNavigate={setView} user={user} />
          )}
          {view === "members" && (
            <MembersView members={members} setMembers={setMembers} onMemberClick={setSelectedMember} user={user} />
          )}
          {view === "classes" && (
            <ClassesView classes={classes} setClasses={setClasses} trainers={trainers} user={user} />
          )}
          {view === "trainers" && <TrainersView trainers={trainers} />}
          {view === "checkins" && <CheckInsView checkIns={checkIns} />}
          {view === "payments" && <PaymentsView payments={payments} setPayments={setPayments} user={user} />}
          {view === "pos" && (
            <POSView products={products} setProducts={setProducts} sales={sales} setSales={setSales} members={members} user={user} />
          )}
          {view === "leads" && (
            <LeadsView leads={leads} setLeads={setLeads} members={members} setMembers={setMembers} />
          )}
          {view === "access" && (
            <AccessControlView accessLogs={accessLogs} setAccessLogs={setAccessLogs} members={members} />
          )}
          {view === "messages" && (
            <MessagesView messages={messages} setMessages={setMessages} templates={templates} setTemplates={setTemplates} members={members} />
          )}
          {view === "analytics" && (
            <AnalyticsView members={members} payments={payments} classes={classes} />
          )}
          {view === "member-stocks" && (
            <MemberStocksView members={members} memberStocks={memberStocks} setMemberStocks={setMemberStocks} />
          )}
          {view === "chat" && (
            <ChatView user={user} directMessages={directMessages} setDirectMessages={setDirectMessages} setNotifications={setNotifications} />
          )}

          {/* ── OPERATIONS (admin / receptionist) ─────────────────────────── */}
          {view === "shifts" && (
            <StaffShiftsView user={user} shifts={shifts} setShifts={setShifts} />
          )}
          {view === "equipment" && (
            <EquipmentView user={user} equipment={equipment} setEquipment={setEquipment} />
          )}
          {view === "expenses" && (
            <ExpensesView user={user} expenses={expenses} setExpenses={setExpenses} payments={payments} />
          )}
          {view === "challenges" && (
            <ChallengesView user={user} challenges={challenges} setChallenges={setChallenges} members={members} checkIns={checkIns} classes={classes} />
          )}

          {/* ── TRAINER VIEWS ──────────────────────────────────────────────── */}
          {view === "trainer-home" && (
            <TrainerHome user={user} classes={classes} members={members} />
          )}
          {view === "my-classes" && (
            <TrainerClasses user={user} classes={classes} members={members} />
          )}
          {view === "my-clients" && (
            <TrainerClients user={user} members={members} onMemberClick={setSelectedMember} />
          )}
          {view === "video-library" && (
            <VideoLibraryView user={user} videos={videos} setVideos={setVideos} />
          )}

          {/* ── MEMBER VIEWS ───────────────────────────────────────────────── */}
          {view === "member-home" && (
            <MemberHome user={user} members={members} classes={classes} payments={payments} checkIns={checkIns} onNavigate={setView}
              workoutLogs={workoutLogs} classRatings={classRatings} setClassRatings={setClassRatings}
            />
          )}
          {view === "my-qr" && (
            <MemberQRView
              user={user} members={members} setMembers={setMembers}
              checkIns={checkIns} setCheckIns={setCheckIns} onNavigate={setView}
              loyaltyPoints={loyaltyPoints} setLoyaltyPoints={setLoyaltyPoints}
            />
          )}
          {view === "book-classes" && (
            <MemberBookClasses
              user={user} classes={classes} setClasses={setClasses}
              loyaltyPoints={loyaltyPoints} setLoyaltyPoints={setLoyaltyPoints}
              setNotifications={setNotifications}
            />
          )}
          {view === "my-history" && (
            <MemberHistory user={user} checkIns={checkIns} classes={classes} />
          )}
          {view === "my-payments" && (
            <MemberPayments user={user} payments={payments} members={members} />
          )}
          {view === "my-shop" && (
            <MemberShop user={user} shopOrders={shopOrders} setShopOrders={setShopOrders} memberStocks={memberStocks} setMemberStocks={setMemberStocks} />
          )}
          {view === "my-stock" && (
            <MemberStock user={user} memberStocks={memberStocks} setMemberStocks={setMemberStocks} onNavigate={setView} />
          )}
          {view === "my-workouts" && (
            <WorkoutLogView user={user} workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs} loyaltyPoints={loyaltyPoints} setLoyaltyPoints={setLoyaltyPoints} />
          )}
          {view === "my-metrics" && (
            <BodyMetricsView user={user} bodyMetrics={bodyMetrics} setBodyMetrics={setBodyMetrics} />
          )}
          {view === "my-rewards" && (
            <LoyaltyRewardsView user={user} loyaltyPoints={loyaltyPoints} checkIns={checkIns} workoutLogs={workoutLogs} classes={classes} members={members} />
          )}
          {view === "my-referrals" && (
            <ReferralView user={user} members={members} />
          )}

          {/* ── NEW MEMBER FEATURES ────────────────────────────────────────── */}
          {view === "my-progress" && (
            <ProgressPhotosView user={user} progressPhotos={progressPhotos} setProgressPhotos={setProgressPhotos} />
          )}
          {view === "leaderboard" && (
            <LeaderboardView members={members} checkIns={checkIns} loyaltyPoints={loyaltyPoints} workoutLogs={workoutLogs} user={user} />
          )}
          {view === "my-plan" && (
            <WorkoutPlanView user={user} workoutPlans={workoutPlans} />
          )}
          {view === "assign-plans" && (
            <AssignPlanView user={user} members={members} workoutPlans={workoutPlans} setWorkoutPlans={setWorkoutPlans} />
          )}

          {/* ── PROFILE ────────────────────────────────────────────────────── */}
          {view === "profile" && (
            <ProfileView user={user} setUser={setUser} members={members} setMembers={setMembers} />
          )}
        </main>

        <BottomNav view={view} setView={(v) => { setView(v); setSidebarOpen(false); }} user={user} />
      </div>

      {selectedMember && (
        <MemberDetail
          member={selectedMember}
          payments={payments.filter((p) => p.memberId === selectedMember.id)}
          checkIns={checkIns.filter((c) => c.memberId === selectedMember.id)}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
}
