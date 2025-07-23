import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Trophy, Clock, Award, BarChart2, ChevronRight, User, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

// Animation variants
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

// Glassmorphic styles
const glassPanel = "bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg";
const glassCardHover = "hover:bg-white/20 hover:border-white/30 transition-all duration-300";

const UserProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white p-4 sm:p-6 lg:p-8">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Profile Header */}
        <motion.div variants={fadeInUp} className={`p-6 rounded-xl mb-8 flex flex-col sm:flex-row items-center gap-6 ${glassPanel}`}>
          <Avatar className="w-24 h-24 text-3xl border-4 border-white/30">
            <AvatarImage src={user?.photoURL} alt={user?.displayName} />
            <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold">{user?.displayName || 'User'}</h1>
            <p className="text-indigo-200 mt-1">{user?.email}</p>
          </div>
          <Button variant="outline" className="ml-auto bg-transparent border-white/50 hover:bg-white/10">
            <Edit className="w-4 h-4 mr-2"/>
            Edit Profile
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={BookOpen} title="Courses Completed" value="12" />
          <StatCard icon={Trophy} title="Certificates Earned" value="8" />
          <StatCard icon={Clock} title="Hours Learned" value="142" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Courses */}
          <motion.div variants={fadeInUp} className={`lg:col-span-2 p-6 rounded-xl ${glassPanel}`}>
            <h2 className="text-2xl font-semibold mb-4">Current Courses</h2>
            <div className="space-y-6">
              <CourseItem title="Advanced React" progress={75} />
              <CourseItem title="Web3 Fundamentals" progress={45} />
              <CourseItem title="UI/UX for Developers" progress={20} />
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={fadeInUp} className={`p-6 rounded-xl ${glassPanel}`}>
            <h2 className="text-2xl font-semibold mb-4">Achievements</h2>
            <ul className="space-y-4">
              <AchievementItem icon={Award} title="Perfect Score" description="100% on the React quiz" />
              <AchievementItem icon={Clock} title="Early Bird" description="Finished a course 2 days early" />
              <AchievementItem icon={Trophy} title="Top 10%" description="Ranked in the top 10% of learners" />
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper Components
const StatCard = ({ icon: Icon, title, value }) => (
  <motion.div variants={fadeInUp} className={`p-6 rounded-xl flex items-center justify-between ${glassPanel} ${glassCardHover}`}>
    <div>
      <p className="text-indigo-200 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
    <div className="p-3 bg-white/10 rounded-full">
      <Icon className="w-7 h-7 text-indigo-300" />
    </div>
  </motion.div>
);

const CourseItem = ({ title, progress }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="font-medium">{title}</h3>
      <span className="text-sm text-indigo-200">{progress}%</span>
    </div>
    <Progress value={progress} className="h-2 bg-white/20" indicatorClassName="bg-gradient-to-r from-cyan-400 to-blue-500" />
  </div>
);

const AchievementItem = ({ icon: Icon, title, description }) => (
  <li className="flex items-center gap-4">
    <div className="p-3 bg-amber-400/20 rounded-full">
      <Icon className="w-6 h-6 text-amber-300" />
    </div>
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-indigo-200">{description}</p>
    </div>
  </li>
);

export default UserProfile;
