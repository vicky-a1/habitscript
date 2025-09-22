import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Lock, Eye, AlertTriangle, FileText, Trash2, Users, Phone, School } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const navigate = useNavigate();

  const faqData = [
    {
      id: 'data-storage',
      question: 'Do you store my child\'s journal entries?',
      answer: 'By default in early pilots, we do not store personally identifying information unless explicitly activated by the school/parent. If you opt into storage for continuity (e.g., access from multiple devices), journals are stored as end-to-end encrypted blobs; only the child (and an authorized parent/guardian, where consented) can read the full text. Aggregated, anonymized signals may be used for teacher dashboards.',
      icon: Shield,
      source: 'MeitY'
    },
    {
      id: 'encryption',
      question: 'What is "end-to-end encryption" here?',
      answer: 'End-to-end encryption means journal text is encrypted on the student\'s device and the server stores only the encrypted blob. Habit Script (or its servers) cannot read the plaintext without the user\'s key. We also use HTTPS/TLS in transit. (Note: in pilot phases we will document exact cryptographic primitives used in technical annexes.)',
      icon: Lock,
      source: null
    },
    {
      id: 'teacher-access',
      question: 'Do teachers or school admins see my child\'s entries?',
      answer: 'No — teachers see only anonymized, aggregated indicators (class participation rates, mood trends, top values). Raw journal text and names are not displayed. Only in a defined safety escalation (and following school/parent agreements) would authorized counselors or POCs view more detail, and that is logged.',
      icon: Eye,
      source: 'MeitY'
    },
    {
      id: 'advertising',
      question: 'Are you targeting ads at students?',
      answer: 'No. We do not serve targeted advertising to students. For children, the DPDP framework prohibits behavioral profiling and targeted ads — we abide by that prohibition.',
      icon: Shield,
      source: 'Tech Policy Press'
    },
    {
      id: 'compliance',
      question: 'What laws and policies do you follow?',
      answer: 'We follow India\'s Digital Personal Data Protection framework (DPDP Act 2023) and related rules, the IT/intermediary rules for platform responsibilities, and NEP 2020 guidance for SEL implementation in schools. We also follow good-practice privacy engineering (data minimization, RBAC, logging). Relevant public documents: government DPDP Act page and NEP 2020 (Ministry of Education).',
      icon: FileText,
      source: 'MeitY'
    },
    {
      id: 'data-deletion',
      question: 'What happens if I want my child\'s data deleted?',
      answer: 'Parents or students (where allowed) can request deletion. After verification, we will delete the encrypted journal blobs and any identifying account information within the period specified in our retention policy; anonymized aggregates already used for product analytics may remain in non-reversible form. Deletion procedures and verification steps are documented in pilot agreements.',
      icon: Trash2,
      source: null
    },
    {
      id: 'safety-alerts',
      question: 'How do you handle red-flag safety alerts?',
      answer: 'Safety alerts follow a layered flow: on-device detection → server validation (with human review) → contact school counselor/parent/guardian only for verified concerns. All such actions are audited and limited to the minimum necessary information for safety. The process is designed to reduce false positives and respect privacy while ensuring student safety.',
      icon: AlertTriangle,
      source: null
    },
    {
      id: 'nep-compliance',
      question: 'Are you compliant with NEP 2020 SEL guidance?',
      answer: 'Yes. Habit Script\'s prompt taxonomy, counselor workflows, and school dashboards are designed to align with NEP 2020 emphasis on SEL and counsellor involvement; we provide materials and onboarding to help teachers implement classroom activities that accompany the app.',
      icon: School,
      source: 'Ministry of Education'
    },
    {
      id: 'school-pilot',
      question: 'If I run a school pilot, what do I need to provide?',
      answer: 'For pilots we request a school contact, a counselor/POC for escalations, and parent/guardian consent collection for minors. We supply a pilot playbook, teacher training, and clear privacy/consent forms.',
      icon: Users,
      source: null
    },
    {
      id: 'contact',
      question: 'Who can I contact for privacy or legal questions?',
      answer: 'Himanshu (+91 75077 44086) or Vikas (+91 98334 50699). For data-specific legal concerns we will provide the contact of our Data Protection Officer (DPO) once a pilot is confirmed.',
      icon: Phone,
      source: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4 text-purple-600 hover:text-purple-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Common questions about Habit Script's privacy, security, and compliance with Indian data protection laws.
            </p>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-6">
          {faqData.map((faq) => {
            const IconComponent = faq.icon;
            return (
              <Card key={faq.id} className="border-l-4 border-l-purple-500 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <IconComponent className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-800 leading-relaxed">
                        {faq.question}
                      </CardTitle>
                      {faq.source && (
                        <CardDescription className="mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            Source: {faq.source}
                          </span>
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-purple-800">
              Still Have Questions?
            </CardTitle>
            <CardDescription className="text-purple-600">
              We're here to help with any additional concerns about privacy, security, or compliance.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="text-sm text-gray-700">
                <strong>Himanshu:</strong> +91 75077 44086
              </div>
              <div className="text-sm text-gray-700">
                <strong>Vikas:</strong> +91 98334 50699
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Available Monday-Friday, 9:00 AM - 6:00 PM IST
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Habit Script. Committed to privacy-first student wellbeing.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;