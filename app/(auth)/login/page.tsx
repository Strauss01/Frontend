"use client";

import { useState } from "react";
import {
  Scale, Eye, EyeOff, ArrowRight, Loader2,
  ShieldCheck, Zap, BookOpen, FileSearch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FEATURES = [
  { icon: FileSearch, label: "AI Document Analysis",  desc: "Extract insights from contracts instantly"  },
  { icon: BookOpen,   label: "Case Law Intelligence", desc: "Search millions of legal precedents"         },
  { icon: Zap,        label: "Real-time Risk Scoring",desc: "Identify high-risk clauses automatically"   },
];

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPw,   setShowPw]   = useState(