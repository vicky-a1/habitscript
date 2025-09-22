import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Shield,
  Users,
  Target,
  Heart,
  BookOpen,
  TrendingUp,
  Lock,
  Smile,
  ArrowLeft,
  Phone,
  Mail,
  Clock,
  MapPin,
  CheckCircle
} from "lucide-react";

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-calm">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold"
                style={{ fontFamily: 'cursive', color: 'rgb(147, 51, 234)' }}>
              About habitscript
            </h1>
          </div>
        </div>

        {/* Mission Section */}
        <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm border-purple-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p className="text-xl mb-6 text-center font-medium text-purple-800">
              Habit Script is a privacy-first journaling app for middle-school students focused on social-emotional learning (SEL).
            </p>
            
            <p className="mb-6">
              Our mission is to make values education and daily reflection simple, private, and measurable for students, teachers and schools — aligned with India's National Education Policy (NEP 2020) and applicable data-protection laws.
            </p>
          </div>
        </Card>

        {/* What We Design For */}
        <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">What We Design For</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <Clock className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Safe Daily Reflection</h3>
              <p className="text-sm text-gray-600">5–7 minutes of guided journaling</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Privacy-Preserving Insights</h3>
              <p className="text-sm text-gray-600">Teacher dashboards with aggregates only</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Parental Control</h3>
              <p className="text-sm text-gray-600">Consent and control where required</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-orange-50 to-red-50">
              <Heart className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Safe Escalation</h3>
              <p className="text-sm text-gray-600">Optional assessments and safety pathways</p>
            </div>
          </div>
        </Card>

        {/* Privacy & Security */}
        <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Privacy & Security First</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-600" />
                Current Operation
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Front-end first prototype</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">No personal identifiers collected by default</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">End-to-end encrypted personal journals</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Visible only to the student (or authorized parent/guardian)</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Compliance Framework
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">India's Digital Personal Data Protection framework</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Relevant IT / intermediary rules</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Ministry of Education guidance on SEL</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">NEP 2020 alignment</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Contact Section */}
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>
          
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">
              For partnerships, pilot requests, policy or safety questions please contact:
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Himanshu</h3>
              <p className="text-purple-600 font-medium text-lg">+91 75077 44086</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Vikas</h3>
              <p className="text-blue-600 font-medium text-lg">+91 98334 50699</p>
            </div>
          </div>
          
          <div className="text-center mt-8 p-4 bg-white/60 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-800">Available Hours</span>
            </div>
            <p className="text-gray-700">10:00–18:00 IST on weekdays</p>
            <p className="text-sm text-gray-600 mt-2">
              Please include your school/organization name and preferred time to meet.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}