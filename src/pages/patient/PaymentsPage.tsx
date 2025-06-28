import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Download, Filter, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const PaymentsPage = () => {
  const [filter, setFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.patient_id) return;
    axios.get('http://127.0.0.1:5000/api/payments?patient_id=' + user.patient_id)
      .then(res => setPayments(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });

  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);

  const getStatusColor = (status: string) => {
    return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
  };

  const handlePayment = (paymentId: number, amount: number) => {
    // Simulate payment process
    toast.success(`Payment of ₹${amount} initiated successfully! 🎉`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-1">Manage your bills and payment history</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>This Month</span>
          </Button>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-orange-600">₹{totalPending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid This Month</p>
                <p className="text-2xl font-bold text-green-600">₹{totalPaid}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All
        </Button>
        <Button
          variant={filter === 'pending' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('pending')}
        >
          Pending
        </Button>
        <Button
          variant={filter === 'paid' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('paid')}
        >
          Paid
        </Button>
      </div>

      {/* Payments List */}
      <div className="space-y-4">
        {filteredPayments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium text-gray-900">{payment.appointmentType}</h3>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                      <p><span className="font-medium">Date:</span> {payment.date}</p>
                      <p><span className="font-medium">Doctor:</span> {payment.doctor}</p>
                    </div>
                    <div>
                      <p><span className="font-medium">Amount:</span> ₹{payment.amount}</p>
                      {payment.method && (
                        <p><span className="font-medium">Method:</span> {payment.method}</p>
                      )}
                      {payment.transactionId && (
                        <p><span className="font-medium">Transaction ID:</span> {payment.transactionId}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="ml-6 flex flex-col space-y-2">
                  {payment.status === 'pending' ? (
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handlePayment(payment.id, payment.amount)}
                    >
                      Pay ₹{payment.amount}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Methods Info */}
      <Card className="bg-blue-50">
        <CardContent className="p-6">
          <h3 className="font-medium text-blue-900 mb-2">Secure Payment Methods</h3>
          <p className="text-sm text-blue-700 mb-3">
            We accept all major payment methods for your convenience
          </p>
          <div className="flex items-center space-x-4 text-sm text-blue-600">
            <span>💳 Credit/Debit Cards</span>
            <span>📱 UPI Payment</span>
            <span>🏦 Net Banking</span>
            <span>💰 Digital Wallets</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsPage;
