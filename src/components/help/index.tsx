import React, { useState } from "react";
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, Box, useTheme } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import HelpOutlineIcon  from '@mui/icons-material/HelpCenter';

// FAQ Data
const faqData = [
    { question: "How many invoices can I create for free?", answer: "You can create up to 10 invoices absolutely free. Need more? Upgrade plans start at just $9 for 200 invoices." },
    { question: "Can I collect payments via UPI, credit, or debit card?", answer: "Yes! Our platform supports multiple payment methods, including UPI, credit, and debit card transactions." },
    { question: "How do I create and send an invoice?", answer: "Simply go to the dashboard, click on 'Create Invoice', fill in the details, and send it to your client via email." },
    { question: "What insights will I see on the dashboard?", answer: "You'll get real-time insights on your invoices, payment collections, and sales trends." },
    { question: "Can I upgrade or switch plans later?", answer: "Absolutely! You can upgrade, downgrade, or switch plans anytime from your account settings." },
    { question: "Is there a mobile app for invoicing?", answer: "Yes, our mobile app lets you create invoices and manage payments on the go." },
    { question: "Can I customize invoice templates?", answer: "Yes! You can add your logo, change colors, and include custom fields." },
    { question: "Do you support recurring invoices?", answer: "Yes, you can set up automated recurring invoices for your clients." },
    { question: "How do I add multiple team members to my account?", answer: "You can invite team members through the 'Settings' section in your dashboard." },
    { question: "Does the system send automatic payment reminders?", answer: "Yes, automated payment reminders can be enabled for overdue invoices." },
    { question: "Can I integrate this invoicing tool with other software?", answer: "Yes, we offer integrations with accounting and CRM tools." },
    { question: "What payment gateways do you support?", answer: "We support Stripe, PayPal, Razorpay, and direct bank transfers." },
    { question: "Can I track overdue invoices?", answer: "Yes, the dashboard highlights overdue invoices and pending payments." },
    { question: "Is there a limit on the number of customers I can add?", answer: "No, you can add unlimited customers, even on the free plan." },
    { question: "Can I generate tax invoices?", answer: "Yes, tax calculations are automated, and GST-compliant invoices are supported." },
    { question: "Is my data secure?", answer: "Absolutely! We use 256-bit encryption to keep your data safe." },
    { question: "Can I offer discounts on invoices?", answer: "Yes, you can apply fixed or percentage-based discounts to invoices." },
    { question: "Does this invoicing tool work for freelancers?", answer: "Yes, freelancers can use our tool to bill clients quickly and track payments." },
    { question: "How do I download an invoice as a PDF?", answer: "Each invoice has a 'Download PDF' option available in the invoice preview." },
    { question: "Can I issue refunds?", answer: "Yes, refunds can be processed through the payment gateway you used." },
    { question: "Do I get notified when a client pays an invoice?", answer: "Yes, you'll receive email notifications when payments are made." },
    { question: "Can I charge late fees on overdue invoices?", answer: "Yes, you can add automatic late fees for overdue invoices." },
    { question: "Is there a transaction fee for payments?", answer: "We do not charge any extra transaction fees, but your payment provider may." },
    { question: "Can I set up different currencies?", answer: "Yes, multi-currency support is available." },
    { question: "What happens if I exceed my plan's invoice limit?", answer: "You'll be prompted to upgrade your plan or purchase additional invoices." },
    { question: "Can I generate reports on my sales and payments?", answer: "Yes, detailed reports are available in the analytics section." },
    { question: "Does this tool support multi-user accounts?", answer: "Yes, our Team Plan allows multiple users with different roles." },
    { question: "Can I collect tips or additional charges on invoices?", answer: "Yes, you can add optional tipping or service charges." },
    { question: "Do you support international payments?", answer: "Yes, we support payments in multiple currencies worldwide." },
    { question: "How can I cancel my subscription?", answer: "You can cancel anytime from the subscription settings in your account." },
    { question: "Can I resend an invoice to a client?", answer: "Yes, invoices can be resent with a single click." },
    { question: "Are my invoices stored securely?", answer: "Yes, all invoices are securely stored in the cloud." },
    { question: "Can I attach files to invoices?", answer: "Yes, you can attach PDFs, images, or other documents to your invoices." },
    { question: "Is customer support available 24/7?", answer: "Our support team is available via chat and email to assist you." },
    { question: "Do you offer discounts for yearly plans?", answer: "Yes, you can save up to 35% by choosing an annual plan." },
    { question: "Can I create invoices in different languages?", answer: "Yes, our invoicing system supports multiple languages." },
    { question: "Do you provide invoice analytics?", answer: "Yes, you can track invoice performance and payment trends with analytics." },
    { question: "Can I use this invoicing tool for subscription billing?", answer: "Yes, you can create recurring invoices for subscription services." },
    { question: "How do I edit an invoice after it’s been sent?", answer: "You can edit invoices before payment is received, but not after." },
    { question: "What happens if a client disputes a payment?", answer: "You can manage disputes through the payment gateway used for transactions." },
    { question: "Can I add multiple tax rates?", answer: "Yes, you can configure multiple tax rates and apply them to invoices." },
    { question: "Does the system support e-signatures?", answer: "Yes, clients can electronically sign invoices for approval." },
    { question: "Can I add custom invoice fields?", answer: "Yes, you can add extra fields to invoices as per your business needs." },
    { question: "Does this tool support inventory tracking?", answer: "Yes, inventory management is available in the advanced plans." },
    { question: "How do I transfer invoice data to accounting software?", answer: "You can export invoices as CSV or integrate with accounting tools." },
    { question: "Do you provide an API for developers?", answer: "Yes, we offer a developer-friendly API for custom integrations." },
    { question: "Can I get a trial of the premium plan?", answer: "Yes, we offer a free trial of premium features for 14 days." },
    { question: "How do I reset my account password?", answer: "You can reset your password from the login page by clicking 'Forgot Password'." }
  ];
  

const HelpSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";

  const filteredFaqs = faqData.filter((faq) =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 5, 
        backgroundColor: isDarkMode ? "#121212" : "#f9f9f9", 
        // borderRadius: 1, 
        // boxShadow: 2 
      }}
    >
      <Box textAlign="center" mb={4}>
        <Typography variant="h4" fontWeight="300" color="primary" gutterBottom>
          <HelpOutlineIcon fontSize="large" sx={{ verticalAlign: "middle", mr: 1 }} /> Frequently Asked Questions
        </Typography>
        <Typography variant="body1" color="textSecondary" fontWeight="300">
          Got questions about creating invoices, collecting payments, or managing your sales insights? We've got answers!
        </Typography>
      </Box>
      
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search FAQs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: isDarkMode ? "#bbb" : "gray" }} />,
        }}
        sx={{ mb: 3, backgroundColor: isDarkMode ? "#333" : "white", borderRadius: 1, color: isDarkMode ? "#fff" : "#000" }}
      />
      
      {searchTerm.length>0 && filteredFaqs.map((faq, index) => (
        <Accordion 
          key={index} 
          sx={{ 
            my: 1, 
            backgroundColor: isDarkMode ? "#232323" : "white", 
            borderRadius: 1, 
            boxShadow: 1, 
            color: isDarkMode ? "#fff" : "#000" 
          }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon color="primary" />}> 
            <Typography variant="subtitle1" fontWeight="300">
              <HelpOutlineIcon fontSize="small" sx={{ verticalAlign: "middle", mr: 1, color: "primary.main" }} /> {faq.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="textSecondary" fontWeight="300">{faq.answer}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
      {/* <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 4, py: 1.5, fontSize: "1rem", borderRadius: 2, fontWeight: "300" }}
        startIcon={<SupportAgentIcon />}
      >
        Contact Support
      </Button> */}
    </Container>
  );
};

export default HelpSection;