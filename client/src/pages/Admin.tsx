import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users, Eye, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Registration } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const {
    data: registrations,
    isLoading,
    error,
  } = useQuery<Registration[]>({
    queryKey: ["/api/admin/registrations"],
    queryFn: async () => {
      const response = await fetch("/api/admin/registrations");
      if (!response.ok) {
        throw new Error("Failed to fetch registrations");
      }
      return response.json();
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading registrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">Failed to load registrations</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                Admin Dashboard
              </h1>
              <p className="text-gray-500 mt-1">Manage registrations and user data</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <Users className="w-4 h-4" />
                <span className="font-semibold">{registrations?.length || 0} Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Registrations</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{registrations?.length || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Video Watched</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {registrations?.filter(r => r.videoWatched).length || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Registrations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {registrations?.filter(r => 
                  new Date(r.createdAt).toDateString() === new Date().toDateString()
                ).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registrations Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            {registrations && registrations.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Email</th>
                      <th className="text-left py-3 px-4 font-semibold">Phone</th>
                      <th className="text-left py-3 px-4 font-semibold">Video Watched</th>
                      <th className="text-left py-3 px-4 font-semibold">Registration Date</th>
                      <th className="text-left py-3 px-4 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration) => (
                      <tr key={registration.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">{registration.id}</td>
                        <td className="py-3 px-4 font-medium">{registration.name}</td>
                        <td className="py-3 px-4">
                          <a 
                            href={`mailto:${registration.email}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {registration.email}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <a 
                            href={`tel:${registration.phone}`}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {registration.phone}
                          </a>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={registration.videoWatched ? "default" : "secondary"}>
                            {registration.videoWatched ? "Yes" : "No"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          {formatDate(registration.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(registration.id)}
                            disabled={deleteRegistration.isPending}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
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
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No registrations found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}