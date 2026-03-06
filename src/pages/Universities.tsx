import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Heart, Star, MapPin, DollarSign, Calendar, BookOpen, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { 
  getAllUniversities, 
  getUniversity, 
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  University 
} from '@/lib/university-api';
import { isAuthed } from '@/lib/auth';

const Universities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    loadUniversities();
    if (isAuthed()) {
      loadFavorites();
    }
  }, []);

  useEffect(() => {
    filterUniversities();
  }, [universities, searchQuery, selectedCountry]);

  const loadUniversities = async () => {
    try {
      const response = await getAllUniversities();
      if (response.success && response.data) {
        setUniversities(response.data as University[]);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить университеты",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    try {
      const response = await getFavorites();
      if (response.success && response.data) {
        const favIds = (response.data as University[]).map(uni => uni.id);
        setFavorites(favIds);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  };

  const filterUniversities = () => {
    let filtered = universities;

    if (searchQuery) {
      filtered = filtered.filter(uni =>
        uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        uni.programs.some(program => program.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(uni => uni.country === selectedCountry);
    }

    setFilteredUniversities(filtered);
  };

  const toggleFavorite = async (universityId: string) => {
    if (!isAuthed()) {
      toast({
        title: "Требуется авторизация",
        description: "Для добавления в цели необходимо войти в систему",
        variant: "destructive"
      });
      return;
    }

    try {
      if (favorites.includes(universityId)) {
        await removeFromFavorites(universityId);
        setFavorites(favorites.filter(id => id !== universityId));
        toast({
          title: "Удалено из целей",
          description: "Университет удален из вашего списка целей"
        });
      } else {
        await addToFavorites(universityId);
        setFavorites([...favorites, universityId]);
        toast({
          title: "Добавлено в цели",
          description: "Университет добавлен в ваш список целей"
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить список целей",
        variant: "destructive"
      });
    }
  };

  const viewUniversityDetails = async (university: University) => {
    if (university.isPremium && !isAuthed()) {
      toast({
        title: "Премиум контент",
        description: "Для просмотра подробной информации необходимо авторизоваться",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await getUniversity(university.id);
      if (response.success && response.data) {
        setSelectedUniversity(response.data as University);
        setShowDetails(true);
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить информацию об университете",
        variant: "destructive"
      });
    }
  };

  const countries = Array.from(new Set(universities.map(uni => uni.country)));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка университетов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Университеты мира</h1>
          <p className="text-xl text-gray-600">Найдите идеальный университет для вашего образования</p>
        </motion.div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Поиск университетов, программ, стран..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={selectedCountry} 
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все страны</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUniversities.map((university, index) => (
            <motion.div
              key={university.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {university.name}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {university.city}, {university.country}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        #{university.ranking}
                      </Badge>
                      {university.isPremium && (
                        <Badge variant="default" className="flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Premium
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {university.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">Программы:</span>
                      <div className="flex flex-wrap gap-1">
                        {university.programs.slice(0, isAuthed() ? 3 : 2).map((program, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {program}
                          </Badge>
                        ))}
                        {(!isAuthed() || university.programs.length > 3) && (
                          <Badge variant="outline" className="text-xs">
                            +{university.programs.length - (isAuthed() ? 3 : 2)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {isAuthed() && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4" />
                        <span className="font-medium">Стоимость:</span>
                        <span>
                          {university.tuitionFee === 0 ? 'Бесплатно' : 
                           `${new Intl.NumberFormat().format(university.tuitionFee)} ${university.currency}/год`}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">Дедлайн:</span>
                      <span>{university.deadline}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => viewUniversityDetails(university)}
                    >
                      Подробнее
                    </Button>
                    {isAuthed() && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(university.id)}
                        className={favorites.includes(university.id) ? 'text-red-500' : ''}
                      >
                        <Heart className={`h-4 w-4 ${favorites.includes(university.id) ? 'fill-current' : ''}`} />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredUniversities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Университеты не найдены</p>
            <p className="text-gray-400 mt-2">Попробуйте изменить параметры поиска</p>
          </div>
        )}
      </div>

      {showDetails && selectedUniversity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedUniversity.name}</h2>
                <p className="text-gray-600 flex items-center gap-1 mt-1">
                  <MapPin className="h-4 w-4" />
                  {selectedUniversity.city}, {selectedUniversity.country}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(false)}
              >
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Описание</h3>
                <p className="text-gray-600">{selectedUniversity.description}</p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Программы обучения</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUniversity.programs.map((program, idx) => (
                    <Badge key={idx} variant="outline">
                      {program}
                    </Badge>
                  ))}
                </div>
              </div>

              {isAuthed() && (
                <>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Требования</h3>
                    <div className="space-y-1 text-sm">
                      <p><strong>GPA:</strong> {selectedUniversity.requirements.gpa}</p>
                      <p><strong>Язык:</strong> {selectedUniversity.requirements.language}</p>
                      <p><strong>Тесты:</strong> {selectedUniversity.requirements.tests.join(', ')}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Стоимость обучения</h3>
                    <p className="text-lg font-semibold text-blue-600">
                      {selectedUniversity.tuitionFee === 0 ? 'Бесплатно' : 
                       `${new Intl.NumberFormat().format(selectedUniversity.tuitionFee)} ${selectedUniversity.currency}/год`}
                    </p>
                  </div>
                </>
              )}

              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Дедлайн подачи документов</h3>
                <p className="text-gray-600">{selectedUniversity.deadline}</p>
              </div>

              {isAuthed() && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-3">Как поступить</h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <p className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span>Подготовьте документы: аттестат, транскрипт GPA, сертификат языка ({selectedUniversity.requirements.language})</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span>Сдайте тесты: {selectedUniversity.requirements.tests.join(', ')}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span>Заполните онлайн-заявку на сайте университета до {selectedUniversity.deadline}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-bold">4.</span>
                      <span>Оплатите application fee (если требуется)</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="font-bold">5.</span>
                      <span>Дождитесь решения (обычно 4-8 недель)</span>
                    </p>
                  </div>
                  <div className="mt-3 text-xs text-blue-600">
                    Минимальный GPA: {selectedUniversity.requirements.gpa}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => window.open(selectedUniversity.website, '_blank')}
                >
                  Веб-сайт университета
                </Button>
                {isAuthed() && (
                  <Button
                    onClick={() => toggleFavorite(selectedUniversity.id)}
                    variant={favorites.includes(selectedUniversity.id) ? 'default' : 'outline'}
                    className={favorites.includes(selectedUniversity.id) ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    {favorites.includes(selectedUniversity.id) ? (
                      <>
                        <Heart className="h-4 w-4 mr-2 fill-current" />
                        Цель (в избранном)
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Добавить в цели
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Universities;
