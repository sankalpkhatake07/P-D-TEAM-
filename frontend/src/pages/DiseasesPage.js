import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Search, Sprout, Wrench, Bug, FlaskConical, Clock, ChevronDown } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PracticeSection = ({ icon: Icon, title, items, color }) => {
  const [open, setOpen] = useState(false);
  if (!items || items.length === 0) return null;
  return (
    <div className="border border-[#1A3626]/10 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4 hover:bg-[#F5F5F0] transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
            <Icon className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-semibold text-[#1A3626] text-sm">{title}</span>
          <span className="text-xs text-[#839E88] bg-[#E8E8E3] px-2 py-0.5 rounded-full">{items.length}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-[#839E88] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-start gap-2.5 text-sm text-[#57695D]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#839E88] mt-1.5 flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DiseasesPage = () => {
  const [diseases, setDiseases] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { t, i18n } = useTranslation();

  useEffect(() => {
    fetchDiseases();
  }, [i18n.language]); // eslint-disable-line

  const fetchDiseases = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/diseases?lang=${i18n.language}`);
      setDiseases(data);
      if (Object.keys(data).length > 0 && !selectedDisease) {
        setSelectedDisease(Object.keys(data)[0]);
      }
    } catch (error) {
      console.error('Failed to fetch diseases:', error);
    } finally {
      setLoading(false);
    }
  };

  const diseaseNames = Object.keys(diseases).filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selected = selectedDisease && diseases[selectedDisease];

  return (
    <Layout>
      <motion.div data-testid="diseases-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A3626] tracking-tight mb-1">{t('diseases')}</h1>
        <p className="text-base text-[#57695D] mb-8">Complete management practices for sugarcane diseases and pests</p>

        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-t-3 border-[#1A3626] mx-auto"></div>
            <p className="mt-4 text-[#839E88]">{t('loading')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Disease List Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#839E88]" />
                <input
                  type="text"
                  placeholder="Search diseases..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FDFDFB] border border-[#839E88]/40 rounded-xl text-sm focus:ring-2 focus:ring-[#1A3626] focus:border-transparent outline-none text-[#1A3626] placeholder:text-[#839E88]"
                />
              </div>
              <div className="max-h-[65vh] overflow-y-auto space-y-1.5 pr-1">
                {diseaseNames.map((name) => (
                  <button
                    key={name}
                    onClick={() => setSelectedDisease(name)}
                    data-testid={`disease-card-${name.toLowerCase().replace(/\s+/g, '-')}`}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedDisease === name
                        ? 'bg-[#1A3626] text-[#FDFDFB] shadow-md shadow-[#1A3626]/20'
                        : 'bg-[#FDFDFB] text-[#1A3626] hover:bg-[#E8E8E3] border border-[#1A3626]/10'
                    }`}
                  >
                    <span>{diseases[name]?.disease_name_local || name}</span>
                    {diseases[name]?.disease_name_local && diseases[name]?.disease_name_local !== name && (
                      <span className={`block text-xs mt-0.5 ${selectedDisease === name ? 'text-white/60' : 'text-[#839E88]'}`}>{name}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Disease Details */}
            <div className="lg:col-span-8">
              {selected ? (
                <motion.div key={selectedDisease} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  className="bg-[#FDFDFB] border border-[#1A3626]/10 rounded-2xl p-6 sm:p-8 space-y-6"
                >
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#1A3626] tracking-tight">
                      {selected.disease_name_local || selectedDisease}
                    </h2>
                    {selected.disease_name_local && selected.disease_name_local !== selectedDisease && (
                      <p className="text-sm text-[#839E88] mt-0.5">{selectedDisease}</p>
                    )}
                  </div>

                  {/* Basic Info */}
                  {selected.symptoms && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selected.symptoms && (
                        <div className="border-l-4 border-[#C25E4B] pl-4">
                          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#839E88] mb-1">{t('symptoms')}</h3>
                          <p className="text-sm text-[#57695D] leading-relaxed">{selected.symptoms}</p>
                        </div>
                      )}
                      {selected.causes && (
                        <div className="border-l-4 border-[#B36B00] pl-4">
                          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#839E88] mb-1">{t('causes')}</h3>
                          <p className="text-sm text-[#57695D] leading-relaxed">{selected.causes}</p>
                        </div>
                      )}
                      {selected.treatment && (
                        <div className="border-l-4 border-[#1A3626] pl-4">
                          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#839E88] mb-1">{t('treatment')}</h3>
                          <p className="text-sm text-[#57695D] leading-relaxed">{selected.treatment}</p>
                        </div>
                      )}
                      {selected.prevention && (
                        <div className="border-l-4 border-[#839E88] pl-4">
                          <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#839E88] mb-1">{t('prevention')}</h3>
                          <p className="text-sm text-[#57695D] leading-relaxed">{selected.prevention}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Practices */}
                  <div>
                    <h3 className="text-lg font-bold text-[#1A3626] mb-3">Management Practices</h3>
                    <div className="space-y-2">
                      <PracticeSection icon={Sprout} title="Cultural Practices" items={selected.cultural_practices} color="bg-[#1A3626]" />
                      <PracticeSection icon={Wrench} title="Mechanical Practices" items={selected.mechanical_practices} color="bg-[#57695D]" />
                      <PracticeSection icon={Bug} title="Biological Practices" items={selected.biological_practices} color="bg-[#839E88]" />
                      <PracticeSection icon={FlaskConical} title="Chemical Practices" items={selected.chemical_practices} color="bg-[#C25E4B]" />
                      <PracticeSection icon={Clock} title="When & How to Spray" items={selected.spray_timing} color="bg-[#B36B00]" />
                    </div>
                  </div>

                  {/* Products */}
                  {selected.syngenta_products && selected.syngenta_products.length > 0 && (
                    <div className="bg-[#D7E8D6] border border-[#A3C4A5] rounded-xl p-5">
                      <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#1A3626] mb-3">{t('recommendedProducts')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {selected.syngenta_products.map((p, i) => (
                          <span key={i} className="bg-[#FDFDFB] px-3 py-1.5 rounded-full text-sm font-medium text-[#1A3626] border border-[#1A3626]/20">{p}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="bg-[#FDFDFB] border border-[#1A3626]/10 rounded-2xl p-16 text-center">
                  <p className="text-[#839E88]">Select a disease to view details</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </Layout>
  );
};
