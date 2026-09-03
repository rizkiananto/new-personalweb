"use client"

import React, { useState } from 'react';
import { Mail, MessageCircle, Linkedin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

const CONTACT_EMAIL = 'akbarrizkiananto@gmail.com';
const WHATSAPP_NUMBER = '6281808177722';
const LINKEDIN_URL = 'https://id.linkedin.com/in/akbarrizki';
const MESSAGE_LIMIT = 300;
const NAME_LIMIT = 60;
const DEFAULT_MESSAGE = "Hi Rizki! I checked out your portfolio and would love to talk about a potential opportunity or collaboration.";

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactDialog = ({ open, onOpenChange }: ContactDialogProps) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const buildBody = () => {
    const intro = name.trim() ? `Hi, I'm ${name.trim()}.\n\n` : '';
    return `${intro}${message.trim()}`;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(buildBody());
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${text}`, '_blank', 'noopener,noreferrer');
  };

  const handleEmail = () => {
    const subject = encodeURIComponent(`Portfolio inquiry${name.trim() ? ` from ${name.trim()}` : ''}`);
    const body = encodeURIComponent(buildBody());
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className='mb-0'>Let&apos;s talk</DialogTitle>
          <DialogDescription><span className="text-xs">Send a quick message. it opens in your own email or WhatsApp app.</span></DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="contact-name" className="text-xs">Name</Label>
            <Input
              id="contact-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_LIMIT}
              placeholder="Your name"
              className="mt-1 text-sm"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="contact-message" className="text-xs">Message</Label>
              <span className="text-[10px] text-muted-foreground">{message.length}/{MESSAGE_LIMIT}</span>
            </div>
            <Textarea
              id="contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_LIMIT))}
              maxLength={MESSAGE_LIMIT}
              rows={4}
              className="mt-1 text-sm resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          <Button onClick={handleWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs gap-2">
            <MessageCircle size={14} /> Send via WhatsApp
          </Button>
          <Button onClick={handleEmail} variant="outline" className="flex-1 text-xs gap-2">
            <Mail size={14} /> Send via Email
          </Button>
        </DialogFooter>

        <div className="flex items-center justify-center gap-2 pt-2 border-t border-dashed border-gray-200">
          <p className="text-[10px] text-muted-foreground mb-0">Or connect on</p>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Linkedin size={12} /> LinkedIn
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactDialog;
