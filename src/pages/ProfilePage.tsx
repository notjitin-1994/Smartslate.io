import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { auth } from '@/lib/firebase';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await auth.signOut();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out. Please try again.');
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-brand-accent" />
      </div>
    );
  }

  if (!user) {
    navigate('/');
    return null;
  }

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <div className="relative">
              <Avatar className="h-20 w-20">
                {user.photoURL ? (
                  <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />
                ) : (
                  <AvatarFallback className="text-2xl">
                    {getInitials(user.displayName || user.email)}
                  </AvatarFallback>
                )}
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-2xl">
                {user.displayName || 'User'}
              </CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
                <p>{user.metadata.creationTime}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Last Sign In</h3>
                <p>{user.metadata.lastSignInTime}</p>
              </div>
              {user.phoneNumber && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Phone</h3>
                  <p>{user.phoneNumber}</p>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email Verified</h3>
                <p>{user.emailVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full sm:w-auto"
          >
            Back to Home
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="w-full sm:w-auto"
          >
            {isSigningOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              'Sign Out'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
