// 'use client'
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// //import { useAuth } from "@/contexts/AuthContext";
// import { User, Mail, LogOut, Edit2, Save, X } from "lucide-react";

// const Profile: React.FC = () => {
//     const { user, signOut, updateProfile } = useAuth();
//     const navigate = useNavigate();
//     const [isEditing, setIsEditing] = useState(false);
//     const [fullName, setFullName] = useState(
//         user?.user_metadata?.full_name || "",
//     );
//     const [loading, setLoading] = useState(false);

//     const handleSignOut = async () => {
//         await signOut();
//         navigate("/");
//     };

//     const handleUpdateProfile = async () => {
//         setLoading(true);
//         const { error } = await updateProfile(fullName);
//         if (!error) {
//             setIsEditing(false);
//         }
//         setLoading(false);
//     };

//     const getAuthProvider = () => {
//         if (user?.app_metadata?.provider === "google") return "Google";
//         if (user?.app_metadata?.provider === "facebook") return "Facebook";
//         return "Email";
//     };

//     const getAvatarUrl = () => {
//         if (user?.user_metadata?.avatar_url) {
//             return user.user_metadata.avatar_url;
//         }
//         return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`;
//     };

//     if (!user) {
//         return (
//             <div className="min-h-screen bg-white flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
//             {/* Navigation */}
//             <nav className="bg-white shadow-sm border-b border-gray-100">
//                 <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">
//                     <div className="flex items-center justify-between h-16">
//                         <div className="flex-shrink-0">
//                             <h1 className="text-2xl font-bold text-orange-600">
//                                 AI V-Chef
//                             </h1>
//                         </div>
//                         <Button
//                             onClick={() => navigate("/")}
//                             variant="ghost"
//                             className="text-gray-600 hover:text-orange-600"
//                         >
//                             Back to Home
//                         </Button>
//                     </div>
//                 </div>
//             </nav>

//             {/* Profile Content */}
//             <div className="max-w-2xl mx-auto py-12 px-4">
//                 <div className="bg-white rounded-lg shadow-xl p-8">
//                     <div className="text-center mb-8">
//                         <div className="relative inline-block">
//                             <img
//                                 src={getAvatarUrl()}
//                                 alt="Profile"
//                                 className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-orange-200"
//                             />
//                             <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
//                                 <div className="w-2 h-2 bg-white rounded-full"></div>
//                             </div>
//                         </div>
//                         <h1 className="text-3xl font-bold text-gray-900 mb-2">
//                             {user.user_metadata?.full_name || "User"}
//                         </h1>
//                         <p className="text-gray-600">Welcome to your profile</p>
//                     </div>

//                     <div className="space-y-6">
//                         {/* Profile Information */}
//                         <div className="bg-gray-50 rounded-lg p-6">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                                 <User className="w-5 h-5 mr-2" />
//                                 Profile Information
//                             </h2>

//                             <div className="space-y-4">
//                                 <div>
//                                     <Label htmlFor="fullName">Full Name</Label>
//                                     {isEditing ? (
//                                         <div className="flex items-center space-x-2 mt-1">
//                                             <Input
//                                                 id="fullName"
//                                                 type="text"
//                                                 value={fullName}
//                                                 onChange={(e) => setFullName(e.target.value)}
//                                                 className="flex-1"
//                                             />
//                                             <Button
//                                                 size="sm"
//                                                 onClick={handleUpdateProfile}
//                                                 disabled={loading}
//                                                 className="bg-green-500 hover:bg-green-600"
//                                             >
//                                                 {loading ? "..." : <Save className="w-4 h-4" />}
//                                             </Button>
//                                             <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 onClick={() => {
//                                                     setIsEditing(false);
//                                                     setFullName(user?.user_metadata?.full_name || "");
//                                                 }}
//                                             >
//                                                 <X className="w-4 h-4" />
//                                             </Button>
//                                         </div>
//                                     ) : (
//                                         <div className="flex items-center justify-between mt-1">
//                                             <p className="text-gray-900 font-medium">
//                                                 {user.user_metadata?.full_name || "Not set"}
//                                             </p>
//                                             <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 onClick={() => setIsEditing(true)}
//                                             >
//                                                 <Edit2 className="w-4 h-4" />
//                                             </Button>
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div>
//                                     <Label>Email Address</Label>
//                                     <div className="flex items-center mt-1">
//                                         <Mail className="w-4 h-4 text-gray-400 mr-2" />
//                                         <p className="text-gray-900 font-medium">{user.email}</p>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <Label>Authentication Provider</Label>
//                                     <p className="text-gray-900 font-medium mt-1">
//                                         {getAuthProvider()}
//                                     </p>
//                                 </div>

//                                 <div>
//                                     <Label>Account Created</Label>
//                                     <p className="text-gray-900 font-medium mt-1">
//                                         {new Date(user.created_at).toLocaleDateString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Account Actions */}
//                         <div className="bg-gray-50 rounded-lg p-6">
//                             <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                                 Account Actions
//                             </h2>

//                             <div className="space-y-3">
//                                 {user.app_metadata?.provider === "email" && (
//                                     <Button
//                                         variant="outline"
//                                         className="w-full justify-start"
//                                         onClick={() => {
//                                             // This would typically open a change password modal
//                                             alert(
//                                                 "Change password functionality would be implemented here",
//                                             );
//                                         }}
//                                     >
//                                         Change Password
//                                     </Button>
//                                 )}

//                                 <Button
//                                     variant="destructive"
//                                     className="w-full justify-start"
//                                     onClick={handleSignOut}
//                                 >
//                                     <LogOut className="w-4 h-4 mr-2" />
//                                     Sign Out
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Profile;
