import React from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, Palette, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Animation variants from UserProfile
const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

// Glassmorphic styles from UserProfile
const glassPanel = "bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg";

const UserSettings = () => {
  // Mock user data for display
  const user = {
    displayName: 'Jitin M Nair',
    email: 'jitin@example.com',
    photoURL: 'https://github.com/shadcn.png',
  };

  const getInitials = (name) => name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white p-4 sm:p-6 lg:p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={fadeInUp} className="text-4xl font-bold mb-8">Settings</motion.h1>

        {/* Profile Settings */}
        <SettingsSection icon={User} title="Profile Settings">
          <div className="flex items-center gap-6 mb-6">
            <Avatar className="w-20 h-20 text-2xl border-4 border-white/30">
              <AvatarImage src={user.photoURL} alt={user.displayName} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div className="flex-grow">
              <label htmlFor="displayName" className="block text-sm font-medium text-indigo-200 mb-2">Display Name</label>
              <Input id="displayName" type="text" defaultValue={user.displayName} className="bg-white/5 border-white/20" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-2">Email Address</label>
            <Input id="email" type="email" defaultValue={user.email} className="bg-white/5 border-white/20" />
          </div>
        </SettingsSection>

        {/* Notification Settings */}
        <SettingsSection icon={Bell} title="Notifications">
          <SettingRow title="Email Notifications" description="Receive emails about your account activity.">
            <Switch defaultChecked />
          </SettingRow>
          <SettingRow title="Push Notifications" description="Get push notifications on your devices.">
            <Switch />
          </SettingRow>
          <SettingRow title="Monthly Newsletter" description="Subscribe to our monthly newsletter.">
            <Switch defaultChecked />
          </SettingRow>
        </SettingsSection>

        {/* Security Settings */}
        <SettingsSection icon={Lock} title="Security">
          <SettingRow title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
            <Button variant="outline" className="bg-transparent border-white/50 hover:bg-white/10">Enable 2FA</Button>
          </SettingRow>
          <SettingRow title="Password" description="Change your password regularly to keep your account secure.">
            <Button variant="outline" className="bg-transparent border-white/50 hover:bg-white/10">Change Password</Button>
          </SettingRow>
        </SettingsSection>

        <motion.div variants={fadeInUp} className="flex justify-end mt-8">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
        </motion.div>

      </motion.div>
    </div>
  );
};

// Helper component for sectioning
const SettingsSection = ({ icon: Icon, title, children }) => (
  <motion.div variants={fadeInUp} className={`p-6 rounded-xl mb-8 ${glassPanel}`}>
    <div className="flex items-center gap-4 mb-6">
      <div className="p-3 bg-white/10 rounded-full">
        <Icon className="w-6 h-6 text-indigo-300" />
      </div>
      <h2 className="text-2xl font-semibold">{title}</h2>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </motion.div>
);

// Helper component for individual settings
const SettingRow = ({ title, description, children }) => (
  <div className="flex justify-between items-center bg-white/5 p-4 rounded-lg border border-white/10">
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-indigo-200">{description}</p>
    </div>
    <div>{children}</div>
  </div>
);

export default UserSettings;
