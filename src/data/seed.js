export const PLAN_PRICES = { Basic: 15000, Standard: 25000, Premium: 40000 };

export const BRANCHES = [
  { id: "b1", name: "Lekki",  address: "Lekki Phase 1, Lagos" },
  { id: "b2", name: "Ikota",  address: "Ikota Shopping Complex, Lekki" },
];

export const DEMO_ACCOUNTS = [
  { username: "admin", password: "admin", role: "admin", name: "Aisha Bello", trainerId: null, memberId: null },
  { username: "reception", password: "reception", role: "receptionist", name: "Chioma Eze", trainerId: null, memberId: null },
  { username: "trainer", password: "trainer", role: "trainer", name: "Jordan Rivera", trainerId: "t1", memberId: null },
  { username: "member", password: "member", role: "member", name: "Amara Okafor", trainerId: null, memberId: "m1" },
];

export const NAV_BY_ROLE = {
  admin: ["dashboard","members","classes","trainers","checkins","payments","pos","leads","access","messages","member-stocks","chat","analytics","shifts","equipment","expenses","challenges","leaderboard","profile"],
  receptionist: ["dashboard","members","classes","checkins","payments","pos","leads","messages","member-stocks","chat","equipment","challenges","leaderboard","profile"],
  trainer: ["trainer-home","my-classes","my-clients","assign-plans","chat","video-library","challenges","profile"],
  member: ["member-home","my-qr","book-classes","my-history","my-payments","my-shop","my-stock","chat","my-workouts","my-metrics","my-progress","my-plan","my-rewards","my-referrals","challenges","leaderboard","profile"],
};

export const seedMembers = [
  { id: "m1", name: "Amara Okafor",    email: "amara@example.com",       phone: "+234 801 234 5678", plan: "Premium",  joinDate: "2025-08-14", expiryDate: "2026-06-14", status: "active",  checkIns: 42,  lastVisit: "2026-04-21", trainerId: "t1", photo: null, referralCode: "DIS-AMR001", referredBy: null, branchId: "b1", pauseRequest: null },
  { id: "m2", name: "David Chen",       email: "d.chen@example.com",      phone: "+234 802 555 1212", plan: "Standard", joinDate: "2025-11-03", expiryDate: "2026-06-03", status: "active",  checkIns: 28,  lastVisit: "2026-04-20", trainerId: "t1", referralCode: "DIS-DVC002", referredBy: "m1", branchId: "b1", pauseRequest: null },
  { id: "m3", name: "Fatima Al-Hassan", email: "fatima.h@example.com",    phone: "+234 803 777 8899", plan: "Premium",  joinDate: "2024-06-21", expiryDate: "2026-06-21", status: "active",  checkIns: 112, lastVisit: "2026-04-22", trainerId: "t2", referralCode: "DIS-FTM003", referredBy: null, branchId: "b2", pauseRequest: null },
  { id: "m4", name: "Marcus Thompson",  email: "m.thompson@example.com",  phone: "+234 805 999 1111", plan: "Basic",    joinDate: "2026-01-15", expiryDate: "2026-04-15", status: "expired", checkIns: 9,   lastVisit: "2026-03-30", trainerId: "t3", referralCode: "DIS-MRC004", referredBy: null, branchId: "b1", pauseRequest: null },
  { id: "m5", name: "Priya Kapoor",     email: "priya.k@example.com",     phone: "+234 807 222 3344", plan: "Standard", joinDate: "2025-09-28", expiryDate: "2026-05-28", status: "active",  checkIns: 56,  lastVisit: "2026-04-19", trainerId: "t2", referralCode: "DIS-PRY005", referredBy: null, branchId: "b2", pauseRequest: null },
  { id: "m6", name: "Olumide Bakare",   email: "olu.b@example.com",       phone: "+234 808 444 7777", plan: "Premium",  joinDate: "2025-12-12", expiryDate: "2026-06-12", status: "active",  checkIns: 38,  lastVisit: "2026-04-22", trainerId: "t1", referralCode: "DIS-OLU006", referredBy: "m1", branchId: "b1", pauseRequest: null },
  { id: "m7", name: "Sarah Mwangi",     email: "s.mwangi@example.com",    phone: "+234 809 333 2222", plan: "Standard", joinDate: "2026-02-08", expiryDate: "2026-05-30", status: "active",  checkIns: 18,  lastVisit: "2026-04-18", trainerId: "t3", referralCode: "DIS-SRH007", referredBy: null, branchId: "b2", pauseRequest: { status: "pending", duration: "1m", requestedDate: "2026-05-28", startDate: "2026-06-01", note: "Travelling abroad for a month" } },
  { id: "m8", name: "Tunde Adeyemi",    email: "tunde.a@example.com",     phone: "+234 810 555 9999", plan: "Basic",    joinDate: "2025-10-22", expiryDate: "2026-05-22", status: "active",  checkIns: 31,  lastVisit: "2026-04-17", trainerId: "t1", referralCode: "DIS-TND008", referredBy: null, branchId: "b1", pauseRequest: null },
];

export const seedTrainers = [
  { id: "t1", name: "Jordan Rivera", specialty: "Strength & Conditioning", clients: 12, rating: 4.9 },
  { id: "t2", name: "Kemi Adebayo", specialty: "Yoga & Mobility", clients: 18, rating: 4.8 },
  { id: "t3", name: "Tomás Vega", specialty: "HIIT & Cardio", clients: 15, rating: 4.7 },
];

export const seedClasses = [
  { id: "c1", name: "Morning HIIT", trainer: "Tomás Vega", trainerId: "t3", time: "06:30", day: "Mon", capacity: 20, booked: 14, bookedMemberIds: ["m1", "m2"], waitlist: [] },
  { id: "c2", name: "Power Yoga", trainer: "Kemi Adebayo", trainerId: "t2", time: "08:00", day: "Mon", capacity: 15, booked: 15, bookedMemberIds: ["m3", "m5"], waitlist: [{ memberId: "m8", memberName: "Tunde Adeyemi" }] },
  { id: "c3", name: "Heavy Lifting", trainer: "Jordan Rivera", trainerId: "t1", time: "18:00", day: "Mon", capacity: 10, booked: 7, bookedMemberIds: ["m1", "m6"], waitlist: [] },
  { id: "c4", name: "Spin Class", trainer: "Tomás Vega", trainerId: "t3", time: "07:00", day: "Tue", capacity: 25, booked: 19, bookedMemberIds: ["m2", "m7"], waitlist: [] },
  { id: "c5", name: "Mobility Flow", trainer: "Kemi Adebayo", trainerId: "t2", time: "17:30", day: "Tue", capacity: 15, booked: 8, bookedMemberIds: ["m3"], waitlist: [] },
  { id: "c6", name: "Strength Circuit", trainer: "Jordan Rivera", trainerId: "t1", time: "19:00", day: "Wed", capacity: 12, booked: 10, bookedMemberIds: ["m1", "m6", "m8"], waitlist: [] },
  { id: "c7", name: "Vinyasa Flow", trainer: "Kemi Adebayo", trainerId: "t2", time: "07:30", day: "Thu", capacity: 15, booked: 12, bookedMemberIds: ["m5"], waitlist: [] },
  { id: "c8", name: "Boxing Cardio", trainer: "Tomás Vega", trainerId: "t3", time: "18:30", day: "Fri", capacity: 18, booked: 16, bookedMemberIds: ["m7"], waitlist: [] },
  { id: "c9", name: "Weekend Warriors", trainer: "Jordan Rivera", trainerId: "t1", time: "09:00", day: "Sat", capacity: 15, booked: 11, bookedMemberIds: ["m1", "m2", "m6"], waitlist: [] },
];

export const seedPayments = [
  { id: "p1", memberId: "m1", memberName: "Amara Okafor", amount: 40000, date: "2026-04-14", status: "paid", method: "Card" },
  { id: "p2", memberId: "m2", memberName: "David Chen", amount: 25000, date: "2026-04-03", status: "paid", method: "Transfer" },
  { id: "p3", memberId: "m3", memberName: "Fatima Al-Hassan", amount: 40000, date: "2026-04-21", status: "paid", method: "Card" },
  { id: "p4", memberId: "m4", memberName: "Marcus Thompson", amount: 15000, date: "2026-04-15", status: "overdue", method: "—" },
  { id: "p5", memberId: "m5", memberName: "Priya Kapoor", amount: 25000, date: "2026-03-28", status: "paid", method: "Cash" },
  { id: "p6", memberId: "m6", memberName: "Olumide Bakare", amount: 40000, date: "2026-04-12", status: "paid", method: "Card" },
  { id: "p7", memberId: "m7", memberName: "Sarah Mwangi", amount: 25000, date: "2026-04-30", status: "pending", method: "—" },
  { id: "p8", memberId: "m8", memberName: "Tunde Adeyemi", amount: 15000, date: "2026-04-22", status: "paid", method: "Transfer" },
  { id: "p9", memberId: "m1", memberName: "Amara Okafor", amount: 40000, date: "2026-03-14", status: "paid", method: "Card" },
  { id: "p10", memberId: "m3", memberName: "Fatima Al-Hassan", amount: 40000, date: "2026-03-21", status: "paid", method: "Card" },
  { id: "p11", memberId: "m6", memberName: "Olumide Bakare", amount: 40000, date: "2026-03-12", status: "paid", method: "Card" },
  { id: "p12", memberId: "m2", memberName: "David Chen", amount: 25000, date: "2026-03-03", status: "paid", method: "Transfer" },
];

export const seedProducts = [
  { id: "prod1", name: "Whey Protein 2kg", category: "Supplements", price: 18000, stock: 24, lowStock: 5, sku: "SUP-WP-2K" },
  { id: "prod2", name: "Pre-Workout (30 servings)", category: "Supplements", price: 12000, stock: 18, lowStock: 5, sku: "SUP-PW-30" },
  { id: "prod3", name: "Disruptors Tee (Black)", category: "Apparel", price: 8500, stock: 32, lowStock: 10, sku: "AP-TEE-BLK" },
  { id: "prod4", name: "Disruptors Tee (Lime)", category: "Apparel", price: 8500, stock: 3, lowStock: 10, sku: "AP-TEE-LIM" },
  { id: "prod5", name: "Lifting Straps", category: "Gear", price: 5500, stock: 15, lowStock: 5, sku: "GR-STR-01" },
  { id: "prod6", name: "Resistance Band Set", category: "Gear", price: 9000, stock: 11, lowStock: 5, sku: "GR-BND-SET" },
  { id: "prod7", name: "Water Bottle (1L)", category: "Accessories", price: 3500, stock: 48, lowStock: 15, sku: "AC-BTL-1L" },
  { id: "prod8", name: "Sports Towel", category: "Accessories", price: 2500, stock: 7, lowStock: 10, sku: "AC-TWL-01" },
  { id: "prod9", name: "Day Pass", category: "Services", price: 3000, stock: 999, lowStock: 0, sku: "SVC-DAY" },
  { id: "prod10", name: "Personal Training Session", category: "Services", price: 15000, stock: 999, lowStock: 0, sku: "SVC-PT" },
];

export const seedSales = [
  { id: "s1", date: "2026-04-22", time: "10:14", memberId: "m1", memberName: "Amara Okafor", items: [{ productId: "prod1", name: "Whey Protein 2kg", qty: 1, price: 18000 }], total: 18000, method: "Card", staffName: "Chioma Eze" },
  { id: "s2", date: "2026-04-22", time: "11:32", memberId: null, memberName: "Walk-in", items: [{ productId: "prod9", name: "Day Pass", qty: 1, price: 3000 }, { productId: "prod7", name: "Water Bottle (1L)", qty: 1, price: 3500 }], total: 6500, method: "Cash", staffName: "Chioma Eze" },
  { id: "s3", date: "2026-04-21", time: "16:45", memberId: "m3", memberName: "Fatima Al-Hassan", items: [{ productId: "prod3", name: "Disruptors Tee (Black)", qty: 2, price: 8500 }], total: 17000, method: "Account", staffName: "Aisha Bello" },
  { id: "s4", date: "2026-04-20", time: "09:22", memberId: "m6", memberName: "Olumide Bakare", items: [{ productId: "prod2", name: "Pre-Workout (30 servings)", qty: 1, price: 12000 }, { productId: "prod5", name: "Lifting Straps", qty: 1, price: 5500 }], total: 17500, method: "Card", staffName: "Chioma Eze" },
];

export const seedShopProducts = [
  { id: "sp1", name: "Resistance Band Set", category: "Fitness Accessories", price: 9000, stock: 11, description: "5-level resistance set" },
  { id: "sp2", name: "Gym Gloves", category: "Fitness Accessories", price: 6500, stock: 20, description: "Anti-slip, padded palm" },
  { id: "sp3", name: "Jump Rope", category: "Fitness Accessories", price: 3500, stock: 15, description: "Speed rope, adjustable length" },
  { id: "sp4", name: "Foam Roller", category: "Fitness Accessories", price: 8000, stock: 8, description: "Deep tissue recovery" },
  { id: "sp5", name: "Yoga Mat", category: "Fitness Accessories", price: 12000, stock: 14, description: "Non-slip, 6mm thick" },
  { id: "sp6", name: "Shaker Cup", category: "Fitness Accessories", price: 2500, stock: 30, description: "700ml BPA-free" },
  { id: "sp7", name: "Lifting Straps", category: "Fitness Accessories", price: 5500, stock: 15, description: "Heavy-duty cotton" },
  { id: "sp8", name: "Water Bottle 1L", category: "Fitness Accessories", price: 3500, stock: 24, description: "Stainless steel, insulated" },
  { id: "sp9", name: "Water (500ml)", category: "Daily Essentials", price: 300, stock: 120, description: "Chilled still water" },
  { id: "sp10", name: "Water (1.5L)", category: "Daily Essentials", price: 600, stock: 60, description: "Chilled still water" },
  { id: "sp11", name: "Orange Juice", category: "Daily Essentials", price: 800, stock: 40, description: "100% natural, 500ml" },
  { id: "sp12", name: "Mixed Fruit Juice", category: "Daily Essentials", price: 1000, stock: 35, description: "Tropical blend, 500ml" },
  { id: "sp13", name: "Energy Drink", category: "Daily Essentials", price: 1500, stock: 50, description: "250ml can" },
  { id: "sp14", name: "Protein Bar", category: "Daily Essentials", price: 1200, stock: 45, description: "20g protein, various flavours" },
  { id: "sp15", name: "Granola Bar", category: "Daily Essentials", price: 800, stock: 60, description: "Oats & honey" },
  { id: "sp16", name: "Banana", category: "Daily Essentials", price: 200, stock: 80, description: "Fresh, natural energy boost" },
];

export const seedLeads = [
  { id: "l1", name: "Bisi Adeleke", email: "bisi.a@example.com", phone: "+234 811 222 3333", source: "Walk-in", stage: "tour-booked", interest: "Premium", notes: "Toured on Apr 19, mentioned wanting to start in May", createdAt: "2026-04-19", assignedTo: "Chioma Eze", lastContact: "2026-04-19" },
  { id: "l2", name: "Kingsley Obi", email: "k.obi@example.com", phone: "+234 812 444 5555", source: "Instagram", stage: "new", interest: "Standard", notes: "DM'd asking about pricing", createdAt: "2026-04-21", assignedTo: "Chioma Eze", lastContact: "2026-04-21" },
  { id: "l3", name: "Adaeze Nwosu", email: "ada.n@example.com", phone: "+234 813 666 7777", source: "Referral", stage: "trial", interest: "Premium", notes: "Friend of Fatima Al-Hassan, completed free week", createdAt: "2026-04-15", assignedTo: "Aisha Bello", lastContact: "2026-04-22" },
  { id: "l4", name: "Yusuf Garba", email: "yusuf.g@example.com", phone: "+234 814 888 9999", source: "Website", stage: "contacted", interest: "Basic", notes: "Wants to compare with competitor first", createdAt: "2026-04-17", assignedTo: "Chioma Eze", lastContact: "2026-04-20" },
  { id: "l5", name: "Ngozi Okonkwo", email: "n.okonkwo@example.com", phone: "+234 815 111 2222", source: "Walk-in", stage: "won", interest: "Standard", notes: "Signed up Apr 22", createdAt: "2026-04-10", assignedTo: "Aisha Bello", lastContact: "2026-04-22" },
  { id: "l6", name: "Emeka Eze", email: "emeka.e@example.com", phone: "+234 816 333 4444", source: "Google Ads", stage: "lost", interest: "Basic", notes: "Found a cheaper gym nearby", createdAt: "2026-04-08", assignedTo: "Chioma Eze", lastContact: "2026-04-14" },
  { id: "l7", name: "Hadiza Mohammed", email: "hadiza.m@example.com", phone: "+234 817 555 6666", source: "Referral", stage: "tour-booked", interest: "Premium", notes: "Tour scheduled for Apr 25 at 4pm", createdAt: "2026-04-22", assignedTo: "Aisha Bello", lastContact: "2026-04-22" },
];

export const LEAD_STAGES = [
  { id: "new", label: "New", color: "bg-stone-100 text-stone-700 border-stone-300" },
  { id: "contacted", label: "Contacted", color: "bg-sky-100 text-sky-800 border-sky-300" },
  { id: "tour-booked", label: "Tour Booked", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "trial", label: "Free Trial", color: "bg-violet-100 text-violet-800 border-violet-300" },
  { id: "won", label: "Won", color: "bg-red-100 text-red-800 border-red-300" },
  { id: "lost", label: "Lost", color: "bg-rose-100 text-rose-800 border-rose-300" },
];

export const seedAccessLogs = [
  { id: "a1", memberId: "m1", memberName: "Amara Okafor", date: "2026-04-22", time: "06:14", door: "Main Entrance", granted: true },
  { id: "a2", memberId: "m3", memberName: "Fatima Al-Hassan", date: "2026-04-22", time: "07:32", door: "Main Entrance", granted: true },
  { id: "a3", memberId: "m6", memberName: "Olumide Bakare", date: "2026-04-22", time: "08:01", door: "Main Entrance", granted: true },
  { id: "a4", memberId: "m4", memberName: "Marcus Thompson", date: "2026-04-22", time: "09:18", door: "Main Entrance", granted: false, reason: "Membership expired" },
  { id: "a5", memberId: "m2", memberName: "David Chen", date: "2026-04-22", time: "10:45", door: "Main Entrance", granted: true },
  { id: "a6", memberId: null, memberName: "Unknown", date: "2026-04-22", time: "11:02", door: "Side Door", granted: false, reason: "Invalid QR code" },
];

export const seedMessages = [
  { id: "msg1", type: "auto", template: "Expiry Reminder", recipient: "Sarah Mwangi", channel: "SMS", status: "sent", date: "2026-04-22", time: "09:00", content: "Hi Sarah, your Disruptors membership expires on May 30. Renew anytime at the front desk." },
  { id: "msg2", type: "auto", template: "Overdue Payment", recipient: "Marcus Thompson", channel: "Email", status: "sent", date: "2026-04-22", time: "08:00", content: "Marcus, your April payment of ₦15,000 is overdue. Please contact us." },
  { id: "msg3", type: "manual", template: null, recipient: "All Premium Members", channel: "Email", status: "sent", date: "2026-04-21", time: "14:30", content: "Premium members: exclusive yoga retreat on May 15. RSVP via app." },
  { id: "msg4", type: "auto", template: "Welcome", recipient: "Sarah Mwangi", channel: "SMS", status: "sent", date: "2026-02-08", time: "10:00", content: "Welcome to Disruptors, Sarah! Your membership is now active." },
  { id: "msg5", type: "auto", template: "Class Reminder", recipient: "Amara Okafor", channel: "SMS", status: "scheduled", date: "2026-04-23", time: "05:30", content: "Reminder: Morning HIIT at 6:30am today. See you there!" },
];

export const seedMemberStocks = [];

export const seedDirectMessages = [
  { id: "dm1", fromId: "trainer", fromName: "Jordan Rivera", fromRole: "trainer", toId: "member", toName: "Amara Okafor", toRole: "member", content: "Great session this morning! Keep up the heavy lifting 💪", timestamp: "2026-05-26T11:30:00", read: false },
  { id: "dm2", fromId: "admin", fromName: "Aisha Bello", fromRole: "admin", toId: "member", toName: "Amara Okafor", toRole: "member", content: "Hi Amara! Your Premium membership expires next month. Would you like to renew early?", timestamp: "2026-05-26T09:00:00", read: true },
  { id: "dm3", fromId: "member", fromName: "Amara Okafor", fromRole: "member", toId: "admin", toName: "Aisha Bello", toRole: "admin", content: "Yes please! I'll come by the front desk today.", timestamp: "2026-05-26T09:15:00", read: true },
  { id: "dm4", fromId: "reception", fromName: "Chioma Eze", fromRole: "receptionist", toId: "trainer", toName: "Jordan Rivera", toRole: "trainer", content: "Jordan, can you cover the 6:30am Saturday session next week?", timestamp: "2026-05-26T14:00:00", read: false },
];

export const seedNotifications = [
  { id: "notif1", userId: "member", type: "message", title: "New message from Jordan Rivera", body: "Great session this morning! Keep up the heavy lifting 💪", timestamp: "2026-05-26T11:30:00", read: false },
  { id: "notif2", userId: "admin", type: "payment", title: "Overdue payment alert", body: "Marcus Thompson's payment of ₦15,000 is now overdue.", timestamp: "2026-05-27T08:00:00", read: false },
  { id: "notif3", userId: "trainer", type: "class", title: "Class today: Heavy Lifting", body: "Your Heavy Lifting class is at 18:00 tonight. 7 members booked.", timestamp: "2026-05-27T07:00:00", read: false },
  { id: "notif4", userId: "member", type: "class", title: "Class today: Strength Circuit", body: "Strength Circuit with Jordan Rivera at 19:00 tonight. Get ready!", timestamp: "2026-05-27T07:00:00", read: false },
  { id: "notif5", userId: "reception", type: "message", title: "New message from Jordan Rivera", body: "Jordan, can you cover the 6:30am Saturday session next week?", timestamp: "2026-05-26T14:00:00", read: false },
];

export const seedTemplates = [
  { id: "tpl1", name: "Welcome", trigger: "Member signs up", channel: "SMS + Email", active: true, body: "Welcome to Disruptors, {{name}}! Your {{plan}} membership is now active. See you at the gym." },
  { id: "tpl2", name: "Expiry Reminder", trigger: "14 days before expiry", channel: "SMS", active: true, body: "Hi {{name}}, your Disruptors membership expires on {{expiry}}. Renew anytime at the front desk." },
  { id: "tpl3", name: "Overdue Payment", trigger: "Payment overdue 3 days", channel: "Email", active: true, body: "{{name}}, your {{month}} payment of ₦{{amount}} is overdue. Please contact us." },
  { id: "tpl4", name: "Class Reminder", trigger: "1 hour before class", channel: "SMS", active: true, body: "Reminder: {{class}} at {{time}} today. See you there!" },
  { id: "tpl5", name: "Birthday", trigger: "On member birthday", channel: "SMS", active: false, body: "Happy birthday, {{name}}! Enjoy a free smoothie on us today." },
];

// ── NEW FEATURE SEED DATA ──────────────────────────────────────────────────

export const seedWorkoutLogs = [
  {
    id: "wl1", memberId: "m1", date: "2026-05-25",
    exercises: [
      { name: "Bench Press", sets: [{ reps: 10, weight: 60 }, { reps: 8, weight: 65 }, { reps: 6, weight: 70 }] },
      { name: "Squat", sets: [{ reps: 10, weight: 80 }, { reps: 8, weight: 85 }] },
      { name: "Deadlift", sets: [{ reps: 8, weight: 100 }, { reps: 6, weight: 110 }] },
    ],
    notes: "Good session — new PR on deadlift!",
  },
  {
    id: "wl2", memberId: "m1", date: "2026-05-22",
    exercises: [
      { name: "Pull-ups", sets: [{ reps: 8, weight: 0 }, { reps: 7, weight: 0 }] },
      { name: "Bent-over Row", sets: [{ reps: 10, weight: 60 }, { reps: 10, weight: 65 }] },
      { name: "Bicep Curl", sets: [{ reps: 12, weight: 20 }, { reps: 10, weight: 22 }] },
    ],
    notes: "",
  },
  {
    id: "wl3", memberId: "m1", date: "2026-05-19",
    exercises: [
      { name: "Overhead Press", sets: [{ reps: 10, weight: 40 }, { reps: 8, weight: 45 }] },
      { name: "Lateral Raise", sets: [{ reps: 15, weight: 10 }, { reps: 12, weight: 10 }] },
      { name: "Tricep Extension", sets: [{ reps: 12, weight: 25 }, { reps: 10, weight: 27 }] },
    ],
    notes: "Shoulders day",
  },
];

export const seedBodyMetrics = [
  { id: "bm1", memberId: "m1", date: "2026-05-01", weight: 85, bodyFat: 22, chest: 100, waist: 88, arms: 36, notes: "Starting baseline" },
  { id: "bm2", memberId: "m1", date: "2026-05-15", weight: 84, bodyFat: 21.5, chest: 101, waist: 87, arms: 36.5, notes: "" },
  { id: "bm3", memberId: "m1", date: "2026-05-27", weight: 83.5, bodyFat: 21, chest: 101.5, waist: 86.5, arms: 37, notes: "Steady progress!" },
];

export const seedLoyaltyPoints = [
  {
    memberId: "m1",
    points: 340,
    history: [
      { id: "lph1", date: "2026-05-25", points: 10, reason: "Class attended: Strength Circuit" },
      { id: "lph2", date: "2026-05-22", points: 5, reason: "Gym check-in" },
      { id: "lph3", date: "2026-05-20", points: 10, reason: "Class attended: Morning HIIT" },
      { id: "lph4", date: "2026-05-18", points: 5, reason: "Gym check-in" },
      { id: "lph5", date: "2026-05-15", points: 15, reason: "Shop purchase" },
      { id: "lph6", date: "2026-05-12", points: 50, reason: "Referral: David Chen joined" },
      { id: "lph7", date: "2026-05-10", points: 10, reason: "Class attended: Heavy Lifting" },
      { id: "lph8", date: "2026-05-08", points: 5, reason: "Gym check-in" },
      { id: "lph9", date: "2026-05-05", points: 2, reason: "Workout logged" },
      { id: "lph10", date: "2026-05-01", points: 50, reason: "Referral: Olumide Bakare joined" },
    ],
  },
];

export const seedChallenges = [
  {
    id: "ch1",
    name: "May Check-in Champion",
    description: "The member with the most gym check-ins in May wins a free month of Premium membership!",
    type: "checkins",
    period: "2026-05",
    active: true,
    prize: "1 month free Premium membership",
    createdBy: "admin",
  },
  {
    id: "ch2",
    name: "Class Streak Challenge",
    description: "Attend the most classes this month and earn 100 bonus loyalty points plus a Disruptors gear pack!",
    type: "classes",
    period: "2026-05",
    active: true,
    prize: "100 bonus points + gear pack",
    createdBy: "admin",
  },
];

export const seedShifts = [
  { id: "sh1", staffId: "trainer", staffName: "Jordan Rivera", role: "trainer", date: "2026-05-27", startTime: "06:00", endTime: "14:00", location: "Main Floor", notes: "" },
  { id: "sh2", staffId: "reception", staffName: "Chioma Eze", role: "receptionist", date: "2026-05-27", startTime: "07:00", endTime: "15:00", location: "Reception", notes: "" },
  { id: "sh3", staffId: "trainer", staffName: "Jordan Rivera", role: "trainer", date: "2026-05-28", startTime: "06:00", endTime: "14:00", location: "Main Floor", notes: "" },
  { id: "sh4", staffId: "reception", staffName: "Chioma Eze", role: "receptionist", date: "2026-05-28", startTime: "08:00", endTime: "16:00", location: "Reception", notes: "" },
  { id: "sh5", staffId: "trainer", staffName: "Jordan Rivera", role: "trainer", date: "2026-05-29", startTime: "07:00", endTime: "15:00", location: "Weight Room", notes: "" },
  { id: "sh6", staffId: "reception", staffName: "Chioma Eze", role: "receptionist", date: "2026-05-29", startTime: "07:00", endTime: "15:00", location: "Reception", notes: "" },
];

export const seedEquipment = [
  { id: "eq1", name: "Treadmill #1", category: "Cardio", status: "operational", purchaseDate: "2023-01-15", lastService: "2026-03-01", nextService: "2026-09-01", notes: "" },
  { id: "eq2", name: "Treadmill #2", category: "Cardio", status: "operational", purchaseDate: "2023-01-15", lastService: "2026-03-01", nextService: "2026-09-01", notes: "" },
  { id: "eq3", name: "Treadmill #3", category: "Cardio", status: "maintenance", purchaseDate: "2023-01-15", lastService: "2026-05-10", nextService: "2026-05-30", notes: "Belt needs replacing — ordered" },
  { id: "eq4", name: "Bench Press Station #1", category: "Free Weights", status: "operational", purchaseDate: "2022-06-01", lastService: "2026-02-15", nextService: "2026-08-15", notes: "" },
  { id: "eq5", name: "Bench Press Station #2", category: "Free Weights", status: "operational", purchaseDate: "2022-06-01", lastService: "2026-02-15", nextService: "2026-08-15", notes: "" },
  { id: "eq6", name: "Cable Machine #1", category: "Machines", status: "operational", purchaseDate: "2023-03-20", lastService: "2026-04-01", nextService: "2026-10-01", notes: "" },
  { id: "eq7", name: "Cable Machine #2", category: "Machines", status: "out-of-service", purchaseDate: "2023-03-20", lastService: "2026-05-10", nextService: "2026-06-15", notes: "Cable snapped — awaiting parts" },
  { id: "eq8", name: "Rowing Machine #1", category: "Cardio", status: "operational", purchaseDate: "2024-01-10", lastService: "2026-01-10", nextService: "2026-07-10", notes: "" },
  { id: "eq9", name: "Squat Rack #1", category: "Free Weights", status: "operational", purchaseDate: "2022-06-01", lastService: "2026-03-01", nextService: "2026-09-01", notes: "" },
  { id: "eq10", name: "Squat Rack #2", category: "Free Weights", status: "operational", purchaseDate: "2022-06-01", lastService: "2026-03-01", nextService: "2026-09-01", notes: "" },
];

export const seedExpenses = [
  { id: "ex1", category: "Rent", amount: 450000, date: "2026-05-01", description: "Monthly facility rent — May", recurring: true },
  { id: "ex2", category: "Utilities", amount: 85000, date: "2026-05-05", description: "Electricity and water — May", recurring: false },
  { id: "ex3", category: "Staff Wages", amount: 380000, date: "2026-05-25", description: "May staff payroll", recurring: true },
  { id: "ex4", category: "Equipment", amount: 45000, date: "2026-05-15", description: "Cable machine repair + parts", recurring: false },
  { id: "ex5", category: "Marketing", amount: 30000, date: "2026-05-10", description: "Instagram ads — May campaign", recurring: false },
  { id: "ex6", category: "Supplies", amount: 22000, date: "2026-05-08", description: "Cleaning supplies & toiletries", recurring: false },
  { id: "ex7", category: "Rent", amount: 450000, date: "2026-04-01", description: "Monthly facility rent — April", recurring: true },
  { id: "ex8", category: "Staff Wages", amount: 380000, date: "2026-04-25", description: "April staff payroll", recurring: true },
  { id: "ex9", category: "Utilities", amount: 92000, date: "2026-04-05", description: "Electricity and water — April", recurring: false },
  { id: "ex10", category: "Marketing", amount: 25000, date: "2026-04-12", description: "Flyer printing + distribution", recurring: false },
];

export const seedVideos = [
  { id: "vid1", title: "Proper Squat Form", trainerId: "t1", trainerName: "Jordan Rivera", category: "Technique", duration: "8:32", emoji: "🏋️", uploadDate: "2026-05-10", description: "Master the fundamental squat pattern — foot placement, depth, breathing, and common mistakes to avoid." },
  { id: "vid2", title: "Core Strength Fundamentals", trainerId: "t2", trainerName: "Kemi Adebayo", category: "Workout", duration: "15:20", emoji: "💪", uploadDate: "2026-05-12", description: "A 15-minute guided core circuit covering planks, dead bugs, pallof press, and hollow holds." },
  { id: "vid3", title: "Mobility for Lifters", trainerId: "t2", trainerName: "Kemi Adebayo", category: "Recovery", duration: "12:05", emoji: "🧘", uploadDate: "2026-05-15", description: "Hip flexor release, thoracic rotation drills, and ankle mobility — essential prep for heavy lifts." },
  { id: "vid4", title: "HIIT Cardio Blast", trainerId: "t3", trainerName: "Tomás Vega", category: "Workout", duration: "20:00", emoji: "🔥", uploadDate: "2026-05-18", description: "20-minute no-equipment HIIT. 40s on, 20s off. All levels welcome." },
  { id: "vid5", title: "How to Deadlift", trainerId: "t1", trainerName: "Jordan Rivera", category: "Technique", duration: "10:15", emoji: "🎯", uploadDate: "2026-05-20", description: "Conventional deadlift from setup to lockout. Includes warm-up sets and full cue breakdown." },
  { id: "vid6", title: "Post-Workout Recovery Routine", trainerId: "t2", trainerName: "Kemi Adebayo", category: "Recovery", duration: "10:00", emoji: "⚡", uploadDate: "2026-05-22", description: "Cool-down stretches and foam rolling routine for faster muscle recovery." },
];

export const seedClassRatings = [];

export const seedProgressPhotos = [];

export const seedWorkoutPlans = [
  {
    id: "wp1",
    trainerId: "t1",
    trainerName: "Jordan Rivera",
    memberId: "m1",
    memberName: "Amara Okafor",
    name: "12-Week Strength Foundation",
    createdDate: "2026-04-01",
    active: true,
    weeks: [
      {
        week: 1,
        sessions: [
          {
            day: "Monday",
            focus: "Upper Body Push",
            exercises: [
              { name: "Bench Press",       sets: 3, reps: "8–10", notes: "Control the descent" },
              { name: "Overhead Press",    sets: 3, reps: "8–10", notes: "" },
              { name: "Tricep Dips",       sets: 3, reps: "12",   notes: "" },
              { name: "Lateral Raises",    sets: 3, reps: "15",   notes: "Light weight, full ROM" },
            ],
          },
          {
            day: "Wednesday",
            focus: "Lower Body",
            exercises: [
              { name: "Barbell Squat",     sets: 4, reps: "6–8",  notes: "Below parallel" },
              { name: "Romanian Deadlift", sets: 3, reps: "10",   notes: "Hip hinge, flat back" },
              { name: "Leg Press",         sets: 3, reps: "12",   notes: "" },
              { name: "Calf Raises",       sets: 4, reps: "15",   notes: "" },
            ],
          },
          {
            day: "Friday",
            focus: "Upper Body Pull",
            exercises: [
              { name: "Deadlift",          sets: 3, reps: "5",    notes: "Form first, then load" },
              { name: "Pull-ups",          sets: 3, reps: "Max",  notes: "" },
              { name: "Barbell Row",       sets: 3, reps: "8–10", notes: "" },
              { name: "Bicep Curls",       sets: 3, reps: "12",   notes: "" },
            ],
          },
        ],
      },
    ],
  },
];
