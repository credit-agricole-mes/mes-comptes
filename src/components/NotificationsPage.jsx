import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info, AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserService from '../services/UserService';

const NotificationsPage = () => {
  const { userCode } = useAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (userCode) {
      const userData = UserService.getUserByCode(userCode);
      setUser(userData);
    }
  }, [userCode]);

  return (
    <div className="p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Bell className="text-blue-600" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        </div>

        {user?.notification ? (
          <div className="space-y-4">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg hover:bg-blue-100 transition">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 mt-1 " size={20} />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Nouvelle notification</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {user.notification}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Il y a quelques instants
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune notification
            </h3>
            <p className="text-gray-500">
              Vous n'avez aucune nouvelle notification pour le moment.
            </p>
          </div>
        )}

        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold text-gray-700 mb-4">Notifications archivées</h3>
          <div className="space-y-3">
            <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-lg opacity-60">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 mt-1 " size={20} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-700 mb-1">Virement effectué</h4>
                  <p className="text-sm text-gray-600">
                    Votre virement de 500€ vers le compte ****1234 a été traité avec succès.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Il y a 2 jours</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-300 p-4 rounded-lg opacity-60">
              <div className="flex items-start gap-3">
                <Info className="text-blue-600 mt-1 " size={20} />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-700 mb-1">Mise à jour de sécurité</h4>
                  <p className="text-sm text-gray-600">
                    Vos paramètres de sécurité ont été mis à jour avec succès.
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Il y a 5 jours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;