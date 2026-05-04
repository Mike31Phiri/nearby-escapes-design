"use client";

import { useState } from "react";
import { Search, MoreHorizontal, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  {
    id: 1,
    name: "Mike Phiri",
    email: "mike.p@email.com",
    role: "traveler",
    status: "active",
    joined: "Jan 2025",
  },
  {
    id: 2,
    name: "Chanda Mulenga",
    email: "chanda.m@email.com",
    role: "host",
    status: "active",
    joined: "Feb 2025",
  },
  {
    id: 3,
    name: "Bwalya Katebe",
    email: "bwalya.k@email.com",
    role: "traveler",
    status: "pending",
    joined: "Mar 2025",
  },
  {
    id: 4,
    name: "Grace Banda",
    email: "grace.b@email.com",
    role: "host",
    status: "suspended",
    joined: "Dec 2024",
  },
  {
    id: 5,
    name: "John Tembo",
    email: "john.t@email.com",
    role: "traveler",
    status: "active",
    joined: "Mar 2025",
  },
];

export function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "pending" | "suspended">("all");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || user.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <AdminLayout title="User Management" description="View and manage user accounts">
      {/* Filters */}
      <Card className="border-border/60 mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              {(["all", "active", "pending", "suspended"] as const).map((status) => (
                <Button
                  key={status}
                  variant={filter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(status)}
                  className="capitalize"
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-border/60">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant={user.role === "host" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.status === "active" && (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="capitalize text-sm">Active</span>
                          </>
                        )}
                        {user.status === "pending" && (
                          <>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <span className="capitalize text-sm">Pending</span>
                          </>
                        )}
                        {user.status === "suspended" && (
                          <>
                            <XCircle className="h-4 w-4 text-red-600" />
                            <span className="capitalize text-sm">Suspended</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{user.joined}</td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit details</DropdownMenuItem>
                          {user.status !== "suspended" ? (
                            <DropdownMenuItem className="text-red-600">
                              Suspend account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">
                              Reactivate account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No users found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
