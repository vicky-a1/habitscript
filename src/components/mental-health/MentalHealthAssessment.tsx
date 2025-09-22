import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Heart,
  User,
  Calendar,
  MapPin,
  Phone,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText
} from 'lucide-react';
import { mentalHealthAPI } from '../../services/mentalHealthAPI';

interface UserInfo {
  name: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  pronouns: string;
  location: string;
  language: string;
  emergencyContact: string;
  emergencyContactConsent: boolean;
}

interface AssessmentData {
  moodRating: number;
  reasonForVisit: string;
  energyLevel: number;
  emotionRegulation: number;
  sleepQuality: number;
  appetiteChanges: boolean;
  physicalSymptoms: string[];
  socialSupport: number;
  schoolWorkFunctioning: number;
  stressors: string[];
  copingStrategies: string[];
  safetyRisk: boolean;
  selfHarmThoughts: boolean;
  suicidalIdeation: boolean;
  unsafeEnvironment: boolean;
  substanceUse: boolean;
}

interface MentalHealthAssessmentProps {
  onComplete?: (userInfo: UserInfo, assessment: AssessmentData) => void;
  onClose: () => void;
}

const physicalSymptomOptions = [
  'Headaches', 'Fatigue', 'Muscle tension', 'Stomach issues',
  'Sleep problems', 'Appetite changes', 'Dizziness', 'Chest pain'
];

const stressorOptions = [
  'School/Work pressure', 'Family issues', 'Relationship problems',
  'Financial stress', 'Health concerns', 'Social media', 'Bullying',
  'Major life changes', 'Trauma/Loss', 'Identity/Self-image'
];

const copingStrategiesOptions = [
  'Exercise', 'Meditation', 'Talking to friends', 'Journaling',
  'Music/Art', 'Reading', 'Gaming', 'Sleeping', 'Eating',
  'Avoiding situations', 'Substance use', 'Self-harm'
];

export default function MentalHealthAssessment({ onComplete, onClose }: MentalHealthAssessmentProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    dateOfBirth: '',
    age: 0,
    gender: '',
    pronouns: '',
    location: '',
    language: 'English',
    emergencyContact: '',
    emergencyContactConsent: false
  });
  
  const [assessment, setAssessment] = useState<AssessmentData>({
    moodRating: 5,
    reasonForVisit: '',
    energyLevel: 5,
    emotionRegulation: 5,
    sleepQuality: 5,
    appetiteChanges: false,
    physicalSymptoms: [],
    socialSupport: 5,
    schoolWorkFunctioning: 5,
    stressors: [],
    copingStrategies: [],
    safetyRisk: false,
    selfHarmThoughts: false,
    suicidalIdeation: false,
    unsafeEnvironment: false,
    substanceUse: false
  });

  const [showCrisisWarning, setShowCrisisWarning] = useState(false);
  const totalSteps = 5;

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateOfBirthChange = (date: string) => {
    const age = calculateAge(date);
    setUserInfo(prev => ({ ...prev, dateOfBirth: date, age }));
  };

  const getAgeAppropriateContent = () => {
    if (userInfo.age < 13) {
      return {
        tone: 'playful',
        language: 'simple',
        moodQuestion: 'How are you feeling today? Pick a number from 1 (very sad) to 10 (super happy)!'
      };
    } else if (userInfo.age < 18) {
      return {
        tone: 'respectful',
        language: 'approachable',
        moodQuestion: 'On a scale of 1-10, how would you rate your mood today?'
      };
    } else {
      return {
        tone: 'professional',
        language: 'clear',
        moodQuestion: 'Please rate your current mood on a scale of 1-10, where 1 is very low and 10 is excellent.'
      };
    }
  };

  const checkForCrisisIndicators = () => {
    const crisisIndicators = [
      assessment.suicidalIdeation,
      assessment.selfHarmThoughts,
      assessment.safetyRisk,
      assessment.unsafeEnvironment,
      assessment.moodRating <= 2
    ];
    
    if (crisisIndicators.some(indicator => indicator)) {
      setShowCrisisWarning(true);
    }
  };

  const handleNext = () => {
    if (currentStep === 4) {
      checkForCrisisIndicators();
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      // Generate assessment report
      const conversationSummary = `User completed mental health assessment. Key concerns: ${assessment.reasonForVisit}. Mood rating: ${assessment.moodRating}/10.`;
      const reportResponse = await mentalHealthAPI.generateReport(userInfo, assessment, conversationSummary);
      
      if (reportResponse.success) {
        console.log('Assessment report generated:', reportResponse.data.report);
      }
      
      if (onComplete) {
        onComplete(userInfo, assessment);
      }
      
      // Show completion message
      alert('Assessment completed successfully. Thank you for taking the time to share with us.');
      onClose();
    } catch (error) {
      console.error('Error completing assessment:', error);
      if (onComplete) {
        onComplete(userInfo, assessment);
      }
      onClose();
    }
  };

  const renderStep = () => {
    const ageContent = getAgeAppropriateContent();
    
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Let's Get to Know You
              </h3>
              <p className="text-gray-600">
                This information helps us provide better support tailored to you.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">What's your name?</Label>
                <Input
                  id="name"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your first name"
                />
              </div>
              
              <div>
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={userInfo.dateOfBirth}
                  onChange={(e) => handleDateOfBirthChange(e.target.value)}
                />
                {userInfo.age > 0 && (
                  <p className="text-sm text-gray-600 mt-1">Age: {userInfo.age} years old</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  value={userInfo.gender}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, gender: e.target.value }))}
                  placeholder="How do you identify?"
                />
              </div>
              
              <div>
                <Label htmlFor="pronouns">Pronouns</Label>
                <Input
                  id="pronouns"
                  value={userInfo.pronouns}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, pronouns: e.target.value }))}
                  placeholder="e.g., they/them, she/her, he/him"
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location (City, State/Country)</Label>
                <Input
                  id="location"
                  value={userInfo.location}
                  onChange={(e) => setUserInfo(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="This helps us provide local resources"
                />
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Emergency Contact (Optional)
              </h3>
              <p className="text-gray-600">
                This information is only used in crisis situations with your consent.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="emergency-consent"
                  checked={userInfo.emergencyContactConsent}
                  onCheckedChange={(checked) => 
                    setUserInfo(prev => ({ ...prev, emergencyContactConsent: checked as boolean }))
                  }
                />
                <Label htmlFor="emergency-consent" className="text-sm">
                  I consent to sharing my emergency contact information if needed
                </Label>
              </div>
              
              {userInfo.emergencyContactConsent && (
                <div>
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input
                    id="emergency-contact"
                    value={userInfo.emergencyContact}
                    onChange={(e) => setUserInfo(prev => ({ ...prev, emergencyContact: e.target.value }))}
                    placeholder="Name and phone number"
                  />
                </div>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                How Are You Feeling?
              </h3>
              <p className="text-gray-600">
                {ageContent.moodQuestion}
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label>Mood Rating: {assessment.moodRating}/10</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.moodRating}
                  onChange={(e) => setAssessment(prev => ({ ...prev, moodRating: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Very Low</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="reason">What brings you here today?</Label>
                <Textarea
                  id="reason"
                  value={assessment.reasonForVisit}
                  onChange={(e) => setAssessment(prev => ({ ...prev, reasonForVisit: e.target.value }))}
                  placeholder="Share what's on your mind..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Energy Level: {assessment.energyLevel}/10</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.energyLevel}
                  onChange={(e) => setAssessment(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
              
              <div>
                <Label>Sleep Quality: {assessment.sleepQuality}/10</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.sleepQuality}
                  onChange={(e) => setAssessment(prev => ({ ...prev, sleepQuality: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Support & Coping
              </h3>
              <p className="text-gray-600">
                Tell us about your support system and how you cope with stress.
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <Label>Social Support: {assessment.socialSupport}/10</Label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={assessment.socialSupport}
                  onChange={(e) => setAssessment(prev => ({ ...prev, socialSupport: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>No Support</span>
                  <span>Strong Support</span>
                </div>
              </div>
              
              <div>
                <Label>Current Stressors (select all that apply):</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {stressorOptions.map((stressor) => (
                    <div key={stressor} className="flex items-center space-x-2">
                      <Checkbox
                        id={stressor}
                        checked={assessment.stressors.includes(stressor)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAssessment(prev => ({
                              ...prev,
                              stressors: [...prev.stressors, stressor]
                            }));
                          } else {
                            setAssessment(prev => ({
                              ...prev,
                              stressors: prev.stressors.filter(s => s !== stressor)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={stressor} className="text-sm">{stressor}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>How do you usually cope with stress? (select all that apply):</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {copingStrategiesOptions.map((strategy) => (
                    <div key={strategy} className="flex items-center space-x-2">
                      <Checkbox
                        id={strategy}
                        checked={assessment.copingStrategies.includes(strategy)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAssessment(prev => ({
                              ...prev,
                              copingStrategies: [...prev.copingStrategies, strategy]
                            }));
                          } else {
                            setAssessment(prev => ({
                              ...prev,
                              copingStrategies: prev.copingStrategies.filter(s => s !== strategy)
                            }));
                          }
                        }}
                      />
                      <Label htmlFor={strategy} className="text-sm">{strategy}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Safety Check
              </h3>
              <p className="text-gray-600">
                These questions help us ensure your safety and wellbeing.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-4">
                  Your safety is our priority. Please answer honestly - this information is confidential.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="self-harm"
                      checked={assessment.selfHarmThoughts}
                      onCheckedChange={(checked) => 
                        setAssessment(prev => ({ ...prev, selfHarmThoughts: checked as boolean }))
                      }
                    />
                    <Label htmlFor="self-harm" className="text-sm">
                      I have thoughts of hurting myself
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="suicidal"
                      checked={assessment.suicidalIdeation}
                      onCheckedChange={(checked) => 
                        setAssessment(prev => ({ ...prev, suicidalIdeation: checked as boolean }))
                      }
                    />
                    <Label htmlFor="suicidal" className="text-sm">
                      I have thoughts of ending my life
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="unsafe-environment"
                      checked={assessment.unsafeEnvironment}
                      onCheckedChange={(checked) => 
                        setAssessment(prev => ({ ...prev, unsafeEnvironment: checked as boolean }))
                      }
                    />
                    <Label htmlFor="unsafe-environment" className="text-sm">
                      I don't feel safe in my current environment
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="safety-risk"
                      checked={assessment.safetyRisk}
                      onCheckedChange={(checked) => 
                        setAssessment(prev => ({ ...prev, safetyRisk: checked as boolean }))
                      }
                    />
                    <Label htmlFor="safety-risk" className="text-sm">
                      I'm concerned about my immediate safety
                    </Label>
                  </div>
                </div>
              </div>
              
              {showCrisisWarning && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-900">Immediate Support Available</h4>
                  </div>
                  <p className="text-red-800 text-sm mb-3">
                    Based on your responses, we want to make sure you have immediate support:
                  </p>
                  <div className="space-y-2 text-sm text-red-800">
                    <p>• Call 988 (Suicide Prevention Lifeline) - Available 24/7</p>
                    <p>• Text HOME to 741741 (Crisis Text Line)</p>
                    <p>• Call 911 if you're in immediate danger</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Mental Health Assessment
            </CardTitle>
            <div className="text-sm text-gray-600">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
        </CardHeader>
        
        <CardContent>
          {renderStep()}
          
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            {currentStep < totalSteps ? (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleComplete} className="bg-green-600">
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Assessment
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}