import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  MapPin,
  Phone,
  Globe,
  Clock,
  Star,
  Filter,
  Search,
  UserCheck,
  Calendar,
  DollarSign,
  Shield
} from 'lucide-react';

interface ProfessionalProvider {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  location: string;
  phone: string;
  website?: string;
  rating: number;
  reviewCount: number;
  acceptsInsurance: boolean;
  telehealth: boolean;
  emergencyAvailable: boolean;
  languages: string[];
  priceRange: '$' | '$$' | '$$$';
  availability: string;
  description: string;
}

interface ProfessionalReferralProps {
  userLocation?: string;
  riskLevel?: 'LOW' | 'MODERATE' | 'HIGH';
}

const ProfessionalReferral: React.FC<ProfessionalReferralProps> = ({ 
  userLocation = 'General Area', 
  riskLevel = 'MODERATE' 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [showInsuranceOnly, setShowInsuranceOnly] = useState(false);
  const [showTelehealthOnly, setShowTelehealthOnly] = useState(false);

  const mockProviders: ProfessionalProvider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Licensed Clinical Psychologist',
      specialties: ['Anxiety', 'Depression', 'Trauma'],
      location: 'Downtown Medical Center',
      phone: '(555) 123-4567',
      website: 'https://example.com',
      rating: 4.8,
      reviewCount: 127,
      acceptsInsurance: true,
      telehealth: true,
      emergencyAvailable: false,
      languages: ['English', 'Spanish'],
      priceRange: '$$',
      availability: 'Next available: Tomorrow',
      description: 'Specializing in cognitive behavioral therapy with 10+ years experience.'
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      title: 'Psychiatrist',
      specialties: ['Bipolar Disorder', 'ADHD', 'Medication Management'],
      location: 'Westside Clinic',
      phone: '(555) 234-5678',
      rating: 4.6,
      reviewCount: 89,
      acceptsInsurance: true,
      telehealth: true,
      emergencyAvailable: true,
      languages: ['English', 'Mandarin'],
      priceRange: '$$$',
      availability: 'Next available: Next week',
      description: 'Board-certified psychiatrist specializing in mood disorders and ADHD.'
    }
  ];

  const specialties = ['all', 'Anxiety', 'Depression', 'Trauma', 'Bipolar Disorder', 'ADHD'];

  const filteredProviders = mockProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = selectedSpecialty === 'all' || provider.specialties.includes(selectedSpecialty);
    const matchesInsurance = !showInsuranceOnly || provider.acceptsInsurance;
    const matchesTelehealth = !showTelehealthOnly || provider.telehealth;
    
    return matchesSearch && matchesSpecialty && matchesInsurance && matchesTelehealth;
  });

  const getUrgencyMessage = () => {
    switch (riskLevel) {
      case 'HIGH':
        return {
          message: 'Urgent: We recommend seeking immediate professional help.',
          color: 'bg-red-100 border-red-300 text-red-800'
        };
      case 'MODERATE':
        return {
          message: 'We recommend connecting with a mental health professional soon.',
          color: 'bg-yellow-100 border-yellow-300 text-yellow-800'
        };
      default:
        return {
          message: 'Consider speaking with a professional for ongoing support.',
          color: 'bg-blue-100 border-blue-300 text-blue-800'
        };
    }
  };

  const urgencyInfo = getUrgencyMessage();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <UserCheck className="w-5 h-5" />
        <h2 className="text-xl font-semibold">Professional Mental Health Providers</h2>
      </div>

      {/* Urgency Banner */}
      <div className={`p-4 rounded-lg border ${urgencyInfo.color}`}>
        <p className="font-medium">{urgencyInfo.message}</p>
        {riskLevel === 'HIGH' && (
          <p className="text-sm mt-1">
            If you're in immediate danger, call 911 or go to your nearest emergency room.
          </p>
        )}
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="search">Search Providers</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="search"
                placeholder="Search by name, specialty, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="specialty">Specialty</Label>
            <select
              id="specialty"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="insurance"
              checked={showInsuranceOnly}
              onChange={(e) => setShowInsuranceOnly(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="insurance">Accepts Insurance</Label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="telehealth"
              checked={showTelehealthOnly}
              onChange={(e) => setShowTelehealthOnly(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="telehealth">Telehealth Available</Label>
          </div>
        </div>
      </div>

      {/* Provider List */}
      <div className="space-y-4">
        {filteredProviders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No providers found matching your criteria.</p>
            <p className="text-sm">Try adjusting your search or filters.</p>
          </div>
        ) : (
          filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{provider.name}</CardTitle>
                    <CardDescription>{provider.title}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{provider.rating}</span>
                    <span className="text-sm text-gray-500">({provider.reviewCount})</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{provider.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{provider.phone}</span>
                    </div>
                    {provider.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a href={provider.website} className="text-blue-600 hover:underline">
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{provider.availability}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span>{provider.priceRange}</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-500">Languages: </span>
                      <span>{provider.languages.join(', ')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.acceptsInsurance && (
                    <Badge className="bg-green-100 text-green-800">
                      <Shield className="w-3 h-3 mr-1" />
                      Insurance
                    </Badge>
                  )}
                  {provider.telehealth && (
                    <Badge className="bg-blue-100 text-blue-800">
                      <Globe className="w-3 h-3 mr-1" />
                      Telehealth
                    </Badge>
                  )}
                  {provider.emergencyAvailable && (
                    <Badge className="bg-red-100 text-red-800">
                      Emergency Available
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Emergency Resources */}
      <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">Emergency Resources</h3>
        <div className="text-sm text-red-700 space-y-1">
          <p><strong>Crisis Hotline:</strong> 988 (Suicide & Crisis Lifeline)</p>
          <p><strong>Emergency:</strong> 911</p>
          <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalReferral;