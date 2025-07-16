// Example integration with your existing auth system
const handleExistingUserAuth = async () => {
  // Check if user is already logged in to your main site
  const existingUser = await fetch('/api/current-user');
  
  if (existingUser.ok) {
    const userData = await existingUser.json();
    // Map your existing user data to our format
    setUser({
      id: userData.id,
      name: userData.name,
      email: userData.email,
      plan: userData.subscription_plan, // Map your plan names
      avatar: userData.avatar_url
    });
    setAppState('authenticated');
  }
};
