"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  TrendingUp, Wallet, ArrowUpRight, 
  ArrowDownLeft, DollarSign, Download,
  CreditCard, Banknote, Calendar, CheckCircle2,
  MoreVertical
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from "recharts";

const data = [
  { month: "Jan", amount: 4500 },
  { month: "Feb", amount: 5200 },
  { month: "Mar", amount: 4800 },
  { month: "Apr", amount: 6100 },
  { month: "May", amount: 8450 },
  { month: "Jun", amount: 7200 },
];

const payouts = [
  { id: "P-8821", date: "May 02, 2024", amount: "ZMW 4,200.00", status: "Paid", method: "Airtel Money" },
  { id: "P-8820", date: "April 28, 2024", amount: "ZMW 2,150.00", status: "Paid", method: "FNB Bank" },
  { id: "P-8819", date: "April 15, 2024", amount: "ZMW 3,800.00", status: "Paid", method: "Airtel Money" },
  { id: "P-8818", date: "April 01, 2024", amount: "ZMW 1,200.00", status: "Paid", method: "MTN Money" },
];

export default function EarningsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 md:px-6 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Earnings</h1>
            <p className="text-muted-foreground text-lg mt-2">Track your revenue and manage your payouts.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-xl h-11 border-2 font-bold flex items-center gap-2"><Download className="h-4 w-4" /> Export Report</Button>
             <Button className="rounded-xl h-11 bg-primary font-bold shadow-lg flex items-center gap-2">Withdraw Funds</Button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="md:col-span-1 bg-[image:var(--gradient-hero)] text-white border-none shadow-2xl rounded-[40px] p-10 relative overflow-hidden">
             <div className="relative z-10 space-y-8">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                   <Wallet className="h-8 w-8 text-white" />
                </div>
                <div>
                   <p className="text-white/60 font-bold uppercase tracking-widest text-xs mb-1">Available Balance</p>
                   <h3 className="text-5xl font-black tracking-tight">ZMW 8,450.00</h3>
                </div>
                <div className="pt-4 flex items-center gap-4">
                   <div className="flex items-center gap-1.5 text-xs font-bold bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      <TrendingUp className="h-3 w-3" /> +12% this month
                   </div>
                </div>
             </div>
             <Wallet className="absolute -bottom-10 -right-10 h-64 w-64 text-white/10 -rotate-12" />
          </Card>

          <Card className="md:col-span-2 border-border/60 shadow-xl rounded-[40px] p-8">
             <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-extrabold tracking-tight">Revenue Overview</h3>
                <div className="flex bg-muted/50 p-1 rounded-xl">
                   <Button variant="ghost" size="sm" className="rounded-lg font-bold text-xs">Yearly</Button>
                   <Button variant="secondary" size="sm" className="rounded-lg font-bold text-xs shadow-sm">Monthly</Button>
                </div>
             </div>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="month" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 12, fontWeight: 700, fill: "#94a3b8" }} 
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      cursor={{ fill: "transparent" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-border/40">
                              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{payload[0].payload.month}</p>
                              <p className="text-lg font-black text-primary">ZMW {payload[0].value}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 8, 8]} barSize={40}>
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 4 ? "#0f766e" : "#f1f5f9"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </Card>
        </div>

        {/* Payout History */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Payout History</h2>
              <Button variant="ghost" className="font-bold text-primary hover:underline">View all</Button>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-4">
                 {payouts.map((p) => (
                   <Card key={p.id} className="border-border/60 shadow-sm rounded-3xl overflow-hidden hover:border-primary/20 transition-all">
                      <CardContent className="p-6 flex items-center justify-between">
                         <div className="flex items-center gap-6">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                               <ArrowDownLeft className="h-6 w-6" />
                            </div>
                            <div>
                               <h4 className="font-bold">{p.method}</h4>
                               <p className="text-xs text-muted-foreground flex items-center gap-2"><Calendar className="h-3 w-3" /> {p.date}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="font-black text-lg">{p.amount}</p>
                            <div className="flex items-center justify-end gap-1.5 text-[10px] font-bold text-emerald-600">
                               <CheckCircle2 className="h-3 w-3" /> {p.status}
                            </div>
                         </div>
                      </CardContent>
                   </Card>
                 ))}
              </div>

              <div className="lg:col-span-1 space-y-8">
                 <Card className="border-border/60 shadow-lg rounded-[32px] p-8">
                    <h3 className="font-bold text-lg mb-6">Payment Methods</h3>
                    <div className="space-y-4">
                       <div className="p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                                <Banknote className="h-5 w-5 text-emerald-600" />
                             </div>
                             <div>
                                <p className="font-bold text-sm">Airtel Money</p>
                                <p className="text-[10px] text-muted-foreground font-medium">Primary • +260 97...567</p>
                             </div>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                       </div>
                       <div className="p-4 rounded-2xl border border-border/60 hover:bg-muted/30 transition-all cursor-pointer flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-white shadow-sm flex items-center justify-center">
                             <CreditCard className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                             <p className="font-bold text-sm">FNB Bank Account</p>
                             <p className="text-[10px] text-muted-foreground font-medium">Checking • ****4291</p>
                          </div>
                       </div>
                    </div>
                    <Button variant="outline" className="w-full mt-6 h-12 rounded-xl border-2 border-dashed font-bold text-muted-foreground hover:text-primary hover:border-primary/50 transition-all">
                       + Add New Method
                    </Button>
                 </Card>
              </div>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
