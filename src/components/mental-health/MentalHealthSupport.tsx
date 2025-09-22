import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Heart,
  AlertTriangle,
  Phone,
  MessageCircle,
  Bot,
  FileText,
  Users,
  Clock,
  ExternalLink
} from 'lucide-react';
import MentalHealthBot from './MentalHealthBot';
import MentalHealthAssessment from './MentalHealthAssessment';
import ProfessionalReferral from './ProfessionalReferral';

export default function MentalHealthSupport() {
  const [showBot, setShowBot] = useState(false);
  const [showAssessment, setShowAssessment] = useState(false);

  const crisisHotlines = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "Free and confidential emotional support 24/7",
      availability: "24/7",
      type: "crisis"
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Free, 24/7 crisis support via text message",
      availability: "24/7",
      type: "text"
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Treatment referral and information service",
      availability: "24/7",
      type: "phone"
    },
    {
      name: "National Domestic Violence Hotline",
      number: "1-800-799-7233",
      description: "Confidential support for domestic violence survivors",
      availability: "24/7",
      type: "crisis"
    }
  ];

  const freeResources = [
    {
      title: "Mental Health America",
      description: "Free mental health screening tools and resources",
      icon: "🧠",
      url: "https://www.mhanational.org"
    },
    {
      title: "NAMI Support Groups",
      description: "Find local and online support groups",
      icon: "👥",
      url: "https://www.nami.org"
    },
    {
      title: "Crisis Text Line",
      description: "Free crisis counseling via text",
      icon: "💬",
      url: "https://www.crisistextline.org"
    },
    {
      title: "Headspace for Work",
      description: "Free meditation and mindfulness resources",
      icon: "🧘",
      url: "https://www.headspace.com"
    },
    {
      title: "7 Cups",
      description: "Free emotional support and online therapy",
      icon: "☕",
      url: "https://www.7cups.com"
    },
    {
      title: "Wellness Recovery Action Plan",
      description: "Self-directed wellness and recovery tools",
      icon: "📋",
      url: "https://www.wellnessrecoveryactionplan.com"
    }
  ];

  const getHotlineIcon = (type: string) => {
    switch (type) {
      case 'crisis': return AlertTriangle;
      case 'text': return MessageCircle;
      default: return Phone;
    }
  };

  const getHotlineColor = (type: string) => {
    switch (type) {
      case 'crisis': return 'bg-red-100 text-red-800 border-red-200';
      case 'text': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Heart className="w-8 h-8 text-pink-600" />
          <h1 className="text-3xl font-bold text-gray-900">Mental Health Support</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          You're not alone. Get free, confidential support 24/7. Talk to someone who understands.
        </p>
      </div>

      {/* Emergency Banner */}
      <Card className="bg-red-50 border-red-200 p-6">
        <div className="flex items-center gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-red-900 mb-2">In Crisis? Get Help Now</h3>
            <p className="text-red-800 mb-4">
              If you're having thoughts of suicide or self-harm, please reach out immediately.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-red-600 text-white">
                <Phone className="w-4 h-4 mr-2" />
                Call 988
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700">
                <MessageCircle className="w-4 h-4 mr-2" />
                Text HOME to 741741
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowBot(true)}>
          <Bot className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Talk to AI Companion</h3>
          <p className="text-gray-600 mb-4">Get immediate support from our mental health AI companion</p>
          <Badge className="bg-blue-100 text-blue-800">Available 24/7</Badge>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setShowAssessment(true)}>
          <FileText className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Mental Health Check</h3>
          <p className="text-gray-600 mb-4">Take a confidential assessment to understand your mental health</p>
          <Badge className="bg-green-100 text-green-800">Free & Private</Badge>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Others</h3>
          <p className="text-gray-600 mb-4">Join support groups and connect with people who understand</p>
          <Badge className="bg-purple-100 text-purple-800">Community Support</Badge>
        </Card>
      </div>

      {/* Crisis Hotlines */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Phone className="w-6 h-6 text-blue-600" />
          Crisis Hotlines & Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crisisHotlines.map((hotline, index) => {
            const IconComponent = getHotlineIcon(hotline.type);
            return (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getHotlineColor(hotline.type)}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{hotline.name}</h3>
                    <p className="text-lg font-bold text-blue-600 mb-2">{hotline.number}</p>
                    <p className="text-gray-600 text-sm mb-2">{hotline.description}</p>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-500">{hotline.availability}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Free Resources */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-600" />
          Free Mental Health Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {freeResources.map((resource, index) => {
            return (
              <Card key={index} className="p-4 hover:shadow-md transition-shadow">
                <div className="text-center">
                  <div className="text-3xl mb-3">{resource.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Professional Referral */}
      <ProfessionalReferral />

      {/* Mental Health Bot Dialog */}
      <Dialog open={showBot} onOpenChange={setShowBot}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              Mental Health AI Companion
            </DialogTitle>
          </DialogHeader>
          <MentalHealthBot onClose={() => setShowBot(false)} />
        </DialogContent>
      </Dialog>

      {/* Assessment Dialog */}
      <Dialog open={showAssessment} onOpenChange={setShowAssessment}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Mental Health Assessment
            </DialogTitle>
          </DialogHeader>
          <MentalHealthAssessment onClose={() => setShowAssessment(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}