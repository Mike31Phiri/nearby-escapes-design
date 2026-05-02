import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Users, Mail, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface GroupMember {
  id: string;
  name: string;
  email: string;
  shareCosts: boolean;
}

export interface GroupBookingData {
  tripName: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  organizerName: string;
  organizerEmail: string;
  description: string;
  members: GroupMember[];
  splitCosts: boolean;
}

interface GroupBookingFormProps {
  onGroupCreated: (data: GroupBookingData) => void;
}

export function GroupBookingForm({ onGroupCreated }: GroupBookingFormProps) {
  const [tripName, setTripName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [splitCosts, setSplitCosts] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMember = () => {
    if (!newMemberName || !newMemberEmail) return;
    
    const newMember: GroupMember = {
      id: crypto.randomUUID(),
      name: newMemberName,
      email: newMemberEmail,
      shareCosts: splitCosts,
    };
    
    setMembers([...members, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || members.length === 0) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const bookingData: GroupBookingData = {
      tripName,
      destination,
      startDate,
      endDate,
      organizerName,
      organizerEmail,
      description,
      members,
      splitCosts,
    };

    onGroupCreated(bookingData);
    setIsSubmitting(false);
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-2xl">Create Group Trip</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Trip Details</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tripName">Trip Name</Label>
                <Input
                  id="tripName"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="e.g., Jamaica Adventure 2025"
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g., Montego Bay, Jamaica"
                  required
                  aria-required="true"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !startDate && 'text-muted-foreground'
                      )}
                      id="startDate"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !endDate && 'text-muted-foreground'
                      )}
                      id="endDate"
                      type="button"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      disabled={(date) => date < (startDate || new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Trip Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your dream group trip..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Organizer Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Organizer Information</h3>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="organizerName">Your Name</Label>
                <Input
                  id="organizerName"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organizerEmail">Your Email</Label>
                <Input
                  id="organizerEmail"
                  type="email"
                  value={organizerEmail}
                  onChange={(e) => setOrganizerEmail(e.target.value)}
                  required
                  aria-required="true"
                />
              </div>
            </div>
          </div>

          {/* Group Members */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Invite Group Members</h3>
            
            <div className="flex gap-2">
              <Input
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Member name"
                aria-label="Member name"
              />
              <Input
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Member email"
                type="email"
                aria-label="Member email"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={addMember}
                disabled={!newMemberName || !newMemberEmail}
                aria-label="Add member"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {members.length > 0 && (
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(member.id)}
                      aria-label={`Remove ${member.name}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="splitCosts"
                checked={splitCosts}
                onChange={(e) => setSplitCosts(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
              <Label htmlFor="splitCosts" className="cursor-pointer">
                Split costs equally among all members
              </Label>
            </div>
          </div>

          {/* Submit */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5" />
                <span>{members.length} member{members.length !== 1 ? 's' : ''} invited</span>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={!startDate || !endDate || members.length === 0 || isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? 'Creating Group...' : 'Create Group Trip'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
