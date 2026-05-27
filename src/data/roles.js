import { Shield, UserCog, GraduationCap, UserCircle2 } from "lucide-react";

export const ROLES = {
  admin: { label: "Admin", icon: Shield, color: "bg-rose-100 text-rose-800" },
  receptionist: { label: "Receptionist", icon: UserCog, color: "bg-sky-100 text-sky-800" },
  trainer: { label: "Trainer", icon: GraduationCap, color: "bg-amber-100 text-amber-800" },
  member: { label: "Member", icon: UserCircle2, color: "bg-lime-100 text-lime-800" },
};
