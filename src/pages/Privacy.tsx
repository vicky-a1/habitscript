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
  CheckCircle,
  AlertTriangle,
  FileText,
  Database,
  Eye,
  UserCheck,
  Globe,
  Scale
} from "lucide-react";

export default function Privacy() {
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
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold"
                style={{ fontFamily: 'cursive', color: 'rgb(147, 51, 234)' }}>
              Privacy Policy
            </h1>
          </div>
        </div>

        {/* Privacy Summary */}
        <Card className="p-8 mb-8 bg-white/80 backdrop-blur-sm border-purple-200">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Privacy Summary</h2>
            <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6"></div>
            <p className="text-lg text-gray-700">Short version for users</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
              <Database className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">No Data Collection</h3>
              <p className="text-sm text-gray-600">We do not collect or store personally identifying data by default</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50">
              <Lock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-gray-600">Journal content is encrypted. Only the student can read their full journal text</p>
            </div>
            
            <div className="text-center p-6 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <Eye className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Anonymous Insights</h3>
              <p className="text-sm text-gray-600">Teacher dashboards show only anonymized, aggregated signals</p>
            </div>
          </div>
          
          <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <UserCheck className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Parental Consent for Minors</h4>
                <p className="text-gray-700">
                  For users under 18, we require verifiable parental/guardian consent before processing any personal data, 
                  and we will not perform behavioral tracking or targeted advertising for children.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Detailed Policy */}
        <div className="space-y-8">
          {/* Section 1: What we collect */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FileText className="w-6 h-6 text-purple-600" />
              1. What we collect and why
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Default Operation
                </h3>
                <p className="text-gray-700 ml-7">
                  Habit Script does not collect personally identifying information (PII) unless a school or parent explicitly registers users. 
                  We operate in a privacy-first mode for trials and demos.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Optional (with consent)
                </h3>
                <p className="text-gray-700 ml-7">
                  School-managed pilots may create minimal accounts (student id, class id) to enable teacher dashboards and reporting. 
                  Only strictly required fields are collected.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                  Analytics
                </h3>
                <p className="text-gray-700 ml-7">
                  Any analytics used for product improvement are based on aggregated, anonymized metrics (no raw journal text).
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  Security
                </h3>
                <p className="text-gray-700 ml-7">
                  All network traffic uses TLS. Journals are end-to-end encrypted using user keys; server storage (if used) keeps encrypted blobs only. 
                  Access to any de-identified analytics data is role-restricted and logged.
                </p>
              </div>
            </div>
          </Card>

          {/* Section 2: Children & parental consent */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-blue-600" />
              2. Children & parental consent
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We treat anyone under 18 years as a child for data-protection purposes. Before processing a child's personal data 
              (creating accounts, linking parent contact, or storing identifiable information), we require verifiable parental/guardian 
              consent and provide parents with clear information about what is processed and why. This aligns with recent Indian 
              data-protection rules and guidance on children's data.
            </p>
          </Card>

          {/* Section 3: No targeted advertising */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
              3. No targeted advertising / no behavioural tracking for children
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We will not perform profiling, behavioral tracking, or targeted advertising directed at children. Any product features 
              that infer behavioral signals for safety or learning are operated under strict safeguards and parental/guardian consent when required.
            </p>
          </Card>

          {/* Section 4: Teacher dashboards */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Eye className="w-6 h-6 text-green-600" />
              4. Teacher dashboards & data minimization
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Teacher views contain only aggregated, anonymized signals (class consistency %, mood trend sparklines, top values). 
              No teacher dashboard exposes raw journal text or identifiable student entries. We apply data-minimization principles 
              and only surface the minimum derived signals teachers need to support SEL activities. This complies with the 
              "least-privilege" and anonymization guidance in the DPDP regime.
            </p>
          </Card>

          {/* Section 5: Alerts & safety */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Heart className="w-6 h-6 text-red-600" />
              5. Alerts & safety workflows (Phase 2)
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If a student expresses severe distress (red-flag), the app will follow a multi-step safety flow:
            </p>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="font-medium text-gray-800">Safety Flow Process</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>On-device detection</li>
                <li>Human review by a trained counselor or school POC</li>
                <li>Contact parents/guardians and escalation only as needed and permitted by law</li>
              </ol>
              <p className="text-sm text-gray-600 mt-3">
                Any disclosure is limited to the minimum information required for safety and is logged. 
                We design this as human-in-the-loop to reduce false positives.
              </p>
            </div>
          </Card>

          {/* Section 6: Data retention */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-purple-600" />
              6. Data retention & deletion
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Students/parents/schools can request deletion of their account and data. Encrypted journal blobs will be deleted on request; 
              we will retain only anonymized aggregates used for product improvement unless a retention period is explicitly agreed for pilots. 
              We publish retention windows clearly to participants in pilot agreements.
            </p>
          </Card>

          {/* Section 7: Cross-border transfers */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Globe className="w-6 h-6 text-blue-600" />
              7. Cross-border transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Any cross-border transfer of data (if applicable later) will follow DPDP Act requirements and any rules specified by the government 
              for data transfer (we will provide notices and obtain consents as required).
            </p>
          </Card>

          {/* Section 8: Legal requests */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <Scale className="w-6 h-6 text-gray-600" />
              8. Legal requests & compliance
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Habit Script will only disclose data in response to lawful orders from competent authorities and only to the extent required by law. 
              We will challenge overly broad requests and inform the data principal (student/parent/school) where permitted. We follow intermediary 
              due-diligence and lawful disclosure rules under India's IT framework.
            </p>
          </Card>

          {/* Section 9: Our commitments */}
          <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              9. Our commitments
            </h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We follow the principles of the Digital Personal Data Protection framework:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Consent</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Data minimization</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Purpose limitation</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Data security</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">User rights</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-gray-700">Role-based access controls</span>
              </div>
            </div>
            
            <p className="text-gray-700 leading-relaxed mt-6">
              For school pilots we provide clear parental consent flows, teacher role-based access controls, and an independent privacy FAQ in plain English.
            </p>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Last updated: January 2025 | Questions? Contact us through our About page.
          </p>
        </div>
      </div>
    </div>
  );
}