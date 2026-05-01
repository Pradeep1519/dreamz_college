// src/counselor/components/WhatsAppButton.tsx

import { useState } from 'react';
import { MessageCircle, Send, X, CheckCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber: string;
  name: string;
  counselorName: string;
  collegeName?: string;
  courseName?: string;
}

const messageTemplates = [
  {
    id: 'greeting',
    title: '👋 Greeting Message',
    template: (name: string, counselorName: string) => 
      `👋 Hello ${name}! This is ${counselorName} from Dreamz College. I'm here to help you with your admission process. Let me know if you have any questions!`
  },
  {
    id: 'followup',
    title: '📞 Follow-up',
    template: (name: string) =>
      `Hi ${name}, just checking in! Have you had a chance to review the college options we discussed? Let me know if you need any assistance.`
  },
  {
    id: 'fee_structure',
    title: '💰 Fee Structure',
    template: (name: string, collegeName?: string) =>
      `Hi ${name}, here's the fee structure for ${collegeName || 'your selected college'}.\n\n• Tuition Fee: ₹1,00,000/year\n• Hostel Fee: ₹80,000/year\n• One-time Registration: ₹10,000\n\nEMI options available!`
  },
  {
    id: 'scholarship',
    title: '🎓 Scholarship Info',
    template: (name: string) =>
      `Hi ${name}, based on your academic scores, you may be eligible for scholarships up to 60%!\n\nTo check your eligibility, please share your 10th & 12th percentage.`
  },
  {
    id: 'counseling',
    title: '📅 Counseling Session',
    template: (name: string) =>
      `Hi ${name}, would you like to schedule a free counseling session with our expert? Let me know your preferred date and time.`
  },
  {
    id: 'application',
    title: '📝 Application Link',
    template: (name: string) =>
      `Hi ${name}, you can apply directly through our website: https://dreamzcollege.in/apply\n\nFill the form and our team will contact you within 24 hours!`
  }
];

export function WhatsAppButton({ phoneNumber, name, counselorName, collegeName, courseName }: WhatsAppButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(messageTemplates[0].template(name, counselorName));
  const [sent, setSent] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      let message = '';
      switch(templateId) {
        case 'greeting':
          message = template.template(name, counselorName);
          break;
        case 'followup':
          message = template.template(name);
          break;
        case 'fee_structure':
          message = template.template(name, collegeName);
          break;
        case 'scholarship':
        case 'counseling':
        case 'application':
          message = template.template(name);
          break;
        default:
          message = template.template(name, counselorName);
      }
      setSelectedTemplate(message);
      setCustomMessage(message);
    }
  };

  const handleSend = () => {
    const message = customMessage || selectedTemplate;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/91${phoneNumber}?text=${encodedMessage}`, '_blank');
    setSent(true);
    setTimeout(() => {
      setShowModal(false);
      setSent(false);
      setCustomMessage('');
    }, 1500);
  };

  const handleCustomMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCustomMessage(e.target.value);
    setSelectedTemplate(e.target.value);
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl font-medium w-full"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-green-600 text-white px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <h3 className="font-semibold">Send WhatsApp Message</h3>
              </div>
              <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-800 font-medium">Message sent!</p>
                  <p className="text-gray-400 text-sm mt-1">WhatsApp chat will open</p>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">To: {name}</p>
                    <p className="text-xs text-gray-400">{phoneNumber}</p>
                  </div>

                  {/* Templates */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Quick Templates:</p>
                    <div className="flex flex-wrap gap-2">
                      {messageTemplates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template.id)}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-green-100 hover:text-green-700 transition"
                        >
                          {template.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message Input */}
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      value={customMessage || selectedTemplate}
                      onChange={handleCustomMessageChange}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Type your message here..."
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleSend}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Send Message
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    WhatsApp will open in a new tab. Click send to deliver message.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}