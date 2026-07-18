import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { useTranslation } from 'react-i18next';
import { Upload, ScanLine, Clock, SendHorizonal, RotateCcw, AlertTriangle, Sprout, Wrench, Bug, FlaskConical, ChevronDown, Leaf, Pill, ShieldAlert, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const PracticeAccordion = ({ section }) => {
  const [open, setOpen] = useState(false);
  const Icon = section.icon;
  return (
    <div className="border border-[#1A3626]/10 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-3 hover:bg-[#F5F5F0] transition-colors">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg ${section.color} flex items-center justify-center`}><Icon className="w-3.5 h-3.5 text-white" /></div>
          <span className="font-semibold text-[#1A3626] text-xs">{section.label}</span>
          <span className="text-[10px] text-[#839E88] bg-[#E8E8E3] px-1.5 py-0.5 rounded-full">{section.items.length}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-[#839E88] transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-1">
          {section.items.map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[#57695D] bg-[#F5F5F0] rounded-md px-3 py-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#839E88] mt-1 flex-shrink-0" />
              <span className="leading-relaxed">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const DashboardPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const { t, i18n } = useTranslation();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => { e.preventDefault(); e.stopPropagation(); setDragActive(e.type === 'dragenter' || e.type === 'dragover'); };
  const handleDrop = (e) => {
    e.preventDefault(); setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file); setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleDetect = async () => {
    if (!selectedFile) return;
    setDetecting(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const { data } = await axios.post(`${API_URL}/api/detect`, formData, { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true });
      setResult(data);
    } catch (error) {
      alert('Detection failed. Please try again.');
    } finally {
      setDetecting(false);
    }
  };

  const handleNewScan = () => { setSelectedFile(null); setPreview(null); setResult(null); };

  return (
    <Layout>
      <motion.div data-testid="dashboard-page" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1A3626] tracking-tight mb-1">{t('dashboard')}</h1>
        <p className="text-base text-[#57695D] mb-10 leading-relaxed">{t('dashboardSubtitle')}</p>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Upload Area - Takes 3 cols */}
          <div className="lg:col-span-3 space-y-6">
            <div
              data-testid="upload-dropzone"
              onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
              onClick={() => !result && fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl min-h-[380px] flex items-center justify-center transition-all duration-300 overflow-hidden ${
                dragActive ? 'border-[#1A3626] bg-[#1A3626]/5 scale-[1.01]' :
                preview ? 'border-[#839E88]/30 bg-[#FDFDFB]' :
                'border-[#839E88] bg-[#E8E8E3]/50 hover:bg-[#E8E8E3] hover:border-[#1A3626] cursor-pointer'
              }`}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
              ) : (
                <div className="text-center p-8">
                  <div className="w-20 h-20 mx-auto mb-5 bg-[#1A3626]/5 rounded-2xl flex items-center justify-center">
                    <Upload className="w-10 h-10 text-[#839E88]" strokeWidth={1.5} />
                  </div>
                  <p className="text-[#1A3626] font-semibold text-lg mb-1">{t('uploadImage')}</p>
                  <p className="text-sm text-[#839E88]">{t('dragDrop')}</p>
                  <p className="text-xs text-[#839E88]/70 mt-3">JPG, PNG up to 10MB</p>
                </div>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

            {!result ? (
              <button
                data-testid="detect-disease-button"
                onClick={handleDetect}
                disabled={!selectedFile || detecting}
                className="w-full bg-[#1A3626] text-[#FDFDFB] py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1A3626]/20 disabled:opacity-40 disabled:hover:translate-y-0 disabled:hover:shadow-none active:translate-y-0"
              >
                {detecting ? (
                  <><div className="animate-spin rounded-full h-6 w-6 border-t-2 border-[#FDFDFB]"></div><span>{t('analyzing')}</span></>
                ) : (
                  <><ScanLine className="w-6 h-6" /><span>{t('detectDisease')}</span></>
                )}
              </button>
            ) : (
              <button data-testid="new-scan-button" onClick={handleNewScan}
                className="w-full bg-[#E8E8E3] text-[#1A3626] py-4 rounded-xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all hover:bg-[#839E88] hover:text-[#FDFDFB]">
                <RotateCcw className="w-5 h-5" /><span>{t('newScan')}</span>
              </button>
            )}
          </div>

          {/* Result Area - Takes 2 cols */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div key="result" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  data-testid="detection-result"
                  className="bg-[#FDFDFB] border border-[#1A3626]/10 rounded-2xl shadow-[4px_4px_10px_rgba(26,54,38,0.05),-4px_-4px_10px_rgba(255,255,255,1)] p-6 space-y-4 max-h-[80vh] overflow-y-auto"
                >
                  {result.overlay_path && (
                    <div className="rounded-xl overflow-hidden bg-[#E8E8E3]">
                      <img src={`${API_URL}/api/files/${result.overlay_path}`} alt="Segmentation" className="w-full h-auto" />
                    </div>
                  )}

                  {result.disease === 'Unrecognized' ? (
                    <div className="bg-[#FCE5CD] border border-[#F3C185] rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className="w-6 h-6 text-[#B36B00] flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-bold text-[#B36B00]">{t('unrecognizedDisease')}</h3>
                          <p className="text-xs text-[#57695D] mt-1">{t('unrecognizedMsg')}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Disease Name + Severity + Status */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-5 h-5 text-[#1A3626]" />
                          <h3 className="text-lg font-bold text-[#1A3626]">{result.disease}</h3>
                          {result.severity && (
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                              result.severity === 'high' ? 'bg-[#F5D0C9] text-[#8F2C1A]' :
                              result.severity === 'medium' ? 'bg-[#FCE5CD] text-[#B36B00]' :
                              'bg-[#D7E8D6] text-[#1A3626]'
                            }`}>{result.severity}</span>
                          )}
                        </div>
                        <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#FCE5CD] text-[#B36B00] border border-[#F3C185]">
                          <Clock className="w-3 h-3 inline mr-1" />{t('pendingReview')}
                        </span>
                      </div>

                      {/* Disease Info */}
                      {result.symptoms && (
                        <div className="grid grid-cols-1 gap-2">
                          <div className="border-l-[3px] border-[#C25E4B] bg-[#C25E4B]/5 rounded-r-lg pl-3 py-2 pr-2">
                            <p className="text-[10px] font-bold text-[#839E88] uppercase tracking-wider">{t('symptoms')}</p>
                            <p className="text-xs text-[#57695D] mt-0.5 leading-relaxed">{result.symptoms}</p>
                          </div>
                          {result.causes && (
                            <div className="border-l-[3px] border-[#B36B00] bg-[#B36B00]/5 rounded-r-lg pl-3 py-2 pr-2">
                              <p className="text-[10px] font-bold text-[#839E88] uppercase tracking-wider">{t('causes')}</p>
                              <p className="text-xs text-[#57695D] mt-0.5 leading-relaxed">{result.causes}</p>
                            </div>
                          )}
                          {result.treatment && (
                            <div className="border-l-[3px] border-[#1A3626] bg-[#1A3626]/5 rounded-r-lg pl-3 py-2 pr-2">
                              <p className="text-[10px] font-bold text-[#839E88] uppercase tracking-wider">{t('treatment')}</p>
                              <p className="text-xs text-[#57695D] mt-0.5 leading-relaxed">{result.treatment}</p>
                            </div>
                          )}
                          {result.prevention && (
                            <div className="border-l-[3px] border-[#839E88] bg-[#839E88]/10 rounded-r-lg pl-3 py-2 pr-2">
                              <p className="text-[10px] font-bold text-[#839E88] uppercase tracking-wider">{t('prevention')}</p>
                              <p className="text-xs text-[#57695D] mt-0.5 leading-relaxed">{result.prevention}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* All Management Practices */}
                      {(result.cultural_practices?.length > 0 || result.chemical_practices?.length > 0) && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-[#1A3626]">
                            {i18n.language === 'mr' ? 'व्यवस्थापन पद्धती' : i18n.language === 'hi' ? 'प्रबंधन प्रथाएं' : 'Management Practices'}
                          </h4>
                          {[
                            { items: result.cultural_practices, icon: Sprout, label: i18n.language === 'mr' ? 'सांस्कृतिक पद्धती' : 'Cultural Practices', color: 'bg-[#1A3626]' },
                            { items: result.mechanical_practices, icon: Wrench, label: i18n.language === 'mr' ? 'यांत्रिक पद्धती' : 'Mechanical Practices', color: 'bg-[#57695D]' },
                            { items: result.biological_practices, icon: Bug, label: i18n.language === 'mr' ? 'जैविक पद्धती' : 'Biological Practices', color: 'bg-[#839E88]' },
                            { items: result.chemical_practices, icon: FlaskConical, label: i18n.language === 'mr' ? 'रासायनिक पद्धती' : 'Chemical Practices', color: 'bg-[#C25E4B]' },
                            { items: result.spray_timing, icon: Clock, label: i18n.language === 'mr' ? 'फवारणी कधी व कशी' : 'When & How to Spray', color: 'bg-[#B36B00]' },
                          ].filter(s => s.items?.length > 0).map((section, si) => (
                            <PracticeAccordion key={si} section={section} />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-[#FDFDFB] border border-[#1A3626]/10 rounded-2xl shadow-[4px_4px_10px_rgba(26,54,38,0.05),-4px_-4px_10px_rgba(255,255,255,1)] p-10 text-center h-full flex flex-col items-center justify-center"
                >
                  <div className="w-24 h-24 bg-[#E8E8E3] rounded-2xl flex items-center justify-center mb-5">
                    <ScanLine className="w-12 h-12 text-[#839E88]" strokeWidth={1} />
                  </div>
                  <p className="text-[#839E88] text-sm">{t('uploadAndDetect')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </Layout>
  );
};
