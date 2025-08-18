import AdminLayout from '../components/layout/AdminLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Save, Store, Bell, Shield, Palette } from 'lucide-react';

const Settings = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure your store settings and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Store Information */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Store className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Store Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="HARV DREAMS" />
              </div>
              <div>
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input id="storeEmail" type="email" defaultValue="info@harvdreams.com" />
              </div>
              <div>
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input id="storePhone" defaultValue="+233 20 123 4567" />
              </div>
              <div>
                <Label htmlFor="storeAddress">Store Address</Label>
                <Input id="storeAddress" defaultValue="Accra, Ghana" />
              </div>
              <Button className="w-full bg-army-green hover:bg-army-green/90">
                <Save className="h-4 w-4 mr-2" />
                Save Store Info
              </Button>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">New Order Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when new orders are placed</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Low Stock Alerts</p>
                  <p className="text-sm text-gray-500">Get notified when products are running low</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Customer Reviews</p>
                  <p className="text-sm text-gray-500">Get notified when customers leave reviews</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Marketing Emails</p>
                  <p className="text-sm text-gray-500">Receive marketing and promotional emails</p>
                </div>
                <Switch />
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <Button variant="outline" className="w-full">
                Change Password
              </Button>
            </div>
          </Card>

          {/* Appearance */}
          <Card className="p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Appearance</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <select id="theme" className="w-full p-2 border border-gray-300 rounded-md" aria-label="Select theme">
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <select id="language" className="w-full p-2 border border-gray-300 rounded-md" aria-label="Select language">
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select id="timezone" className="w-full p-2 border border-gray-300 rounded-md" aria-label="Select timezone">
                  <option value="GMT">GMT (UTC+0)</option>
                  <option value="WAT">WAT (UTC+1)</option>
                  <option value="EST">EST (UTC-5)</option>
                </select>
              </div>
              <Button variant="outline" className="w-full">
                Save Preferences
              </Button>
            </div>
          </Card>
        </div>

        {/* Advanced Settings */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-sm font-medium">Backup Data</span>
              <span className="text-xs text-gray-500">Export store data</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-sm font-medium">API Keys</span>
              <span className="text-xs text-gray-500">Manage integrations</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-sm font-medium">System Logs</span>
              <span className="text-xs text-gray-500">View activity logs</span>
            </Button>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;
