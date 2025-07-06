import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trash2, Users, Eye, Calendar, LogOut, Settings, Download, FileText, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Registration, User, UpdateUserData } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  // Check authentication
  const {
    data: authData,
    isLoading: authLoading,
    error: authError,
  } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        throw new Error("Not authenticated");
      }
      return response.json();
    },
    retry: false,
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authError && !authLoading) {
      setLocation("/login");
    }
  }, [authError, authLoading, setLocation]);

  const {
    data: registrations,
    isLoading,
    error,
  } = useQuery<Registration[]>({
    queryKey: ["/api/admin/registrations"],
    queryFn: async () => {
      const response = await fetch("/api/admin/registrations");
      if (!response.ok) {
        if (response.status === 401) {
          setLocation("/login");
        }
        throw new Error("Failed to fetch registrations");
      }
      return response.json();
    },
    enabled: !!authData,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Failed to logout");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Logged out successfully",
      });
      setLocation("/login");
    },
  });

  // Update credentials mutation
  const updateCredentialsMutation = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await fetch("/api/admin/update-credentials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update credentials");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Credentials updated successfully",
      });
      setSettingsOpen(false);
      setCredentials({ username: "", password: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteRegistration = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/registrations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete registration");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/registrations"] });
      toast({
        title: "Success",
        description: "Registration deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete registration",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this registration?")) {
      deleteRegistration.mutate(id);
    }
  };

  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    const updateData: UpdateUserData = {};
    if (credentials.username) updateData.username = credentials.username;
    if (credentials.password) updateData.password = credentials.password;
    
    if (Object.keys(updateData).length > 0) {
      updateCredentialsMutation.mutate(updateData);
    }
  };

  const exportToCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast({
        title: "No Data",
        description: "No registrations to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Video Watched", "Registration Date"];
    const csvData = [
      headers.join(","),
      ...registrations.map(reg => [
        reg.id,
        `"${reg.name}"`,
        reg.email,
        reg.phone,
        reg.videoWatched ? "Yes" : "No",
        `"${formatDate(reg.createdAt)}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Data exported to CSV successfully",
    });
  };

  const exportToJSON = () => {
    if (!registrations || registrations.length === 0) {
      toast({
        title: "No Data",
        description: "No registrations to export",
        variant: "destructive",
      });
      return;
    }

    const jsonData = JSON.stringify(registrations, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Data exported to JSON successfully",
    });
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {authLoading ? "Checking authentication..." : "Loading dashboard..."}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Failed to load registrations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: "Montserrat, sans-serif", color: "#2C5CDC" }}>
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Welcome {authData?.user?.username} - Manage registrations and settings
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-orange-100 text-blue-800 px-4 py-2 rounded-full">
                <Users className="w-4 h-4" />
                <span className="font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {registrations?.length || 0} Total
                </span>
              </div>
              
              {/* Export Dropdown */}
              <div className="flex space-x-2">
                <Button
                  onClick={exportToCSV}
                  variant="outline"
                  size="sm"
                  className="bg-green-50 hover:bg-green-100 border-green-200 text-green-700"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button
                  onClick={exportToJSON}
                  variant="outline"
                  size="sm"
                  className="bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-700"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  JSON
                </Button>
              </div>

              {/* Settings */}
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-gray-50 hover:bg-gray-100">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle style={{ fontFamily: "Montserrat, sans-serif", color: "#2C5CDC" }}>
                      Update Admin Credentials
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdateCredentials} className="space-y-4">
                    <div>
                      <Label htmlFor="newUsername" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        New Email (leave blank to keep current)
                      </Label>
                      <Input
                        id="newUsername"
                        type="email"
                        placeholder="new-email@doneforyoupros.com"
                        value={credentials.username}
                        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        New Password (leave blank to keep current)
                      </Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-orange-500 hover:from-blue-700 hover:to-orange-600"
                        disabled={updateCredentialsMutation.isPending}
                      >
                        {updateCredentialsMutation.isPending ? "Updating..." : "Update"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSettingsOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              {/* Logout */}
              <Button
                onClick={() => logoutMutation.mutate()}
                variant="outline"
                size="sm"
                className="bg-red-50 hover:bg-red-100 border-red-200 text-red-700"
                disabled={logoutMutation.isPending}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ fontFamily: "Montserrat, sans-serif", color: "#2C5CDC" }}>
                Total Registrations
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-800" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {registrations?.length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ fontFamily: "Montserrat, sans-serif", color: "#F76D46" }}>
                Video Watched
              </CardTitle>
              <Eye className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-800" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {registrations?.filter(r => r.videoWatched).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium" style={{ fontFamily: "Montserrat, sans-serif", color: "#059669" }}>
                Today's Registrations
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-800" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {registrations?.filter(r => 
                  new Date(r.createdAt).toDateString() === new Date().toDateString()
                ).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card className="bg-white shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50 border-b">
            <CardTitle style={{ fontFamily: "Montserrat, sans-serif", color: "#2C5CDC" }}>
              User Registrations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {registrations && registrations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>Phone</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>Video Watched</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>Registration Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700" style={{ fontFamily: "Montserrat, sans-serif" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration, index) => (
                      <tr 
                        key={registration.id} 
                        className={`border-b hover:bg-gradient-to-r hover:from-blue-25 hover:to-orange-25 transition-colors ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                        }`}
                      >
                        <td className="py-4 px-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                            #{registration.id}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                          {registration.name}
                        </td>
                        <td className="py-4 px-6">
                          <a 
                            href={`mailto:${registration.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {registration.email}
                          </a>
                        </td>
                        <td className="py-4 px-6">
                          <a 
                            href={`tel:${registration.phone}`}
                            className="text-orange-600 hover:text-orange-800 hover:underline transition-colors"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {registration.phone}
                          </a>
                        </td>
                        <td className="py-4 px-6">
                          <Badge 
                            variant={registration.videoWatched ? "default" : "secondary"}
                            className={registration.videoWatched ? 
                              "bg-green-100 text-green-800 hover:bg-green-200" : 
                              "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }
                          >
                            {registration.videoWatched ? "✓ Yes" : "✗ No"}
                          </Badge>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
                          {formatDate(registration.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(registration.id)}
                            disabled={deleteRegistration.isPending}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 border-red-200 hover:border-red-300 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  No registrations found
                </p>
                <p className="text-gray-400 text-sm mt-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Users will appear here once they register
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}