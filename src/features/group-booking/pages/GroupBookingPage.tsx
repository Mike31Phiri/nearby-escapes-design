import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { GroupBookingForm, type GroupBookingData } from '../components/GroupBookingForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Mail, Calendar, DollarSign, CheckCircle, Send } from 'lucide-react';

export function GroupBookingPage() {
  const navigate = useNavigate();
  const [groupCreated, setGroupCreated] = useState(false);
  const [groupData, setGroupData] = useState<GroupBookingData | null>(null);

  const handleGroupCreated = (data: GroupBookingData) => {
    setGroupData(data);
    setGroupCreated(true);
  };

  if (groupCreated && groupData) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">Group Trip Created!</h1>
              <p className="text-muted-foreground">
                Your group trip "{groupData.tripName}" has been created successfully.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-muted rounded-lg p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Trip Details
                </h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Destination:</strong> {groupData.destination}</p>
                  <p><strong>Dates:</strong> {groupData.startDate.toLocaleDateString()} - {groupData.endDate.toLocaleDateString()}</p>
                  <p><strong>Organizer:</strong> {groupData.organizerName}</p>
                  <p><strong>Members:</strong> {groupData.members.length} invited</p>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-6">
                <h2 className="font-semibold mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Splitting
                </h2>
                <div className="space-y-2 text-sm">
                  <p>
                    <strong>Split Costs:</strong>{' '}
                    {groupData.splitCosts ? 'Yes, equally among all members' : 'No, organizer pays all'}
                  </p>
                  {groupData.splitCosts && (
                    <p className="text-muted-foreground">
                      Each member will be responsible for their share of the total cost.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-6 mb-8">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Next Steps
              </h2>
              <ol className="space-y-3 text-sm list-decimal list-inside">
                <li>Invitation emails will be sent to all group members</li>
                <li>Members can accept the invitation and view trip details</li>
                <li>Add activities, accommodations, and transport to your trip</li>
                <li>Track payments and manage bookings in one place</li>
              </ol>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                onClick={() => navigate({ to: '/trips' })}
                className="flex items-center gap-2"
              >
                <Users className="h-4 w-4" />
                View My Trips
              </Button>
              <Button
                onClick={() => {
                  // In production, this would trigger actual email sending
                  alert('Invitations sent to all members!');
                }}
                className="flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Send Invitations Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Create a Group Trip</h1>
            <p className="text-muted-foreground text-lg">
              Plan an unforgettable adventure with friends and family. Create your group,
              invite members, and start booking experiences together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">1. Create Group</h3>
                <p className="text-sm text-muted-foreground">
                  Set up your trip details and invite friends
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">2. Book Together</h3>
                <p className="text-sm text-muted-foreground">
                  Add stays, gems, transport, and activities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">3. Split Costs</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically divide expenses among members
                </p>
              </CardContent>
            </Card>
          </div>

          <GroupBookingForm onGroupCreated={handleGroupCreated} />
        </div>
      </div>
    </div>
  );
}
