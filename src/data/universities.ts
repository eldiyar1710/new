export interface University {
  id: string;
  name: string;
  country: string;
  city: string;
  ranking: number;
  description: string;
  programs: string[];
  tuitionFee: number;
  currency: string;
  requirements: {
    gpa: number;
    language: string;
    tests: string[];
  };
  deadline: string;
  website: string;
  image: string;
  isPremium: boolean;
}

export const universities: University[] = [
  {
    id: "1",
    name: "Harvard University",
    country: "USA",
    city: "Cambridge, MA",
    ranking: 1,
    description: "One of the most prestigious universities in the world, offering excellence in education and research.",
    programs: ["Computer Science", "Business", "Law", "Medicine", "Engineering"],
    tuitionFee: 55000,
    currency: "USD",
    requirements: {
      gpa: 3.8,
      language: "English",
      tests: ["SAT", "TOEFL"]
    },
    deadline: "2024-01-01",
    website: "https://harvard.edu",
    image: "/placeholder.svg",
    isPremium: true
  },
  {
    id: "2",
    name: "MIT",
    country: "USA",
    city: "Cambridge, MA",
    ranking: 2,
    description: "Leading institution in science, technology, and innovation with world-class research facilities.",
    programs: ["Engineering", "Computer Science", "Physics", "Mathematics", "Architecture"],
    tuitionFee: 58000,
    currency: "USD",
    requirements: {
      gpa: 3.9,
      language: "English",
      tests: ["SAT", "TOEFL"]
    },
    deadline: "2024-01-01",
    website: "https://mit.edu",
    image: "/placeholder.svg",
    isPremium: true
  },
  {
    id: "3",
    name: "Stanford University",
    country: "USA",
    city: "Stanford, CA",
    ranking: 3,
    description: "Silicon Valley's premier university known for entrepreneurship and cutting-edge research.",
    programs: ["Computer Science", "Business", "Medicine", "Engineering", "Law"],
    tuitionFee: 56000,
    currency: "USD",
    requirements: {
      gpa: 3.8,
      language: "English",
      tests: ["SAT", "TOEFL"]
    },
    deadline: "2024-01-02",
    website: "https://stanford.edu",
    image: "/placeholder.svg",
    isPremium: true
  },
  {
    id: "4",
    name: "Oxford University",
    country: "UK",
    city: "Oxford",
    ranking: 4,
    description: "One of the oldest and most respected universities in the world with rich academic traditions.",
    programs: ["Philosophy", "Politics", "Economics", "Medicine", "Law"],
    tuitionFee: 35000,
    currency: "GBP",
    requirements: {
      gpa: 3.7,
      language: "English",
      tests: ["IELTS"]
    },
    deadline: "2024-01-15",
    website: "https://ox.ac.uk",
    image: "/placeholder.svg",
    isPremium: true
  },
  {
    id: "5",
    name: "Cambridge University",
    country: "UK",
    city: "Cambridge",
    ranking: 5,
    description: "World-renowned institution known for academic excellence and groundbreaking research.",
    programs: ["Mathematics", "Engineering", "Medicine", "Natural Sciences", "Computer Science"],
    tuitionFee: 33000,
    currency: "GBP",
    requirements: {
      gpa: 3.7,
      language: "English",
      tests: ["IELTS"]
    },
    deadline: "2024-01-15",
    website: "https://cam.ac.uk",
    image: "/placeholder.svg",
    isPremium: true
  },
  {
    id: "6",
    name: "ETH Zurich",
    country: "Switzerland",
    city: "Zurich",
    ranking: 6,
    description: "Leading technical university in Europe known for innovation and scientific research.",
    programs: ["Engineering", "Computer Science", "Physics", "Mathematics", "Architecture"],
    tuitionFee: 12000,
    currency: "CHF",
    requirements: {
      gpa: 3.6,
      language: "English/German",
      tests: ["IELTS/TOEFL"]
    },
    deadline: "2024-04-30",
    website: "https://ethz.ch",
    image: "/placeholder.svg",
    isPremium: false
  },
  {
    id: "7",
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto",
    ranking: 7,
    description: "Canada's top university with diverse programs and international reputation.",
    programs: ["Computer Science", "Engineering", "Medicine", "Business", "Arts"],
    tuitionFee: 45000,
    currency: "CAD",
    requirements: {
      gpa: 3.5,
      language: "English",
      tests: ["IELTS/TOEFL"]
    },
    deadline: "2024-01-15",
    website: "https://utoronto.ca",
    image: "/placeholder.svg",
    isPremium: false
  },
  {
    id: "8",
    name: "Technical University of Munich",
    country: "Germany",
    city: "Munich",
    ranking: 8,
    description: "Germany's top technical university with strong industry connections.",
    programs: ["Engineering", "Computer Science", "Physics", "Chemistry", "Medicine"],
    tuitionFee: 0,
    currency: "EUR",
    requirements: {
      gpa: 3.3,
      language: "English/German",
      tests: ["IELTS/TOEFL"]
    },
    deadline: "2024-07-15",
    website: "https://tum.de",
    image: "/placeholder.svg",
    isPremium: false
  }
];

export const getUniversityById = (id: string): University | undefined => {
  return universities.find(uni => uni.id === id);
};

export const getUniversitiesByCountry = (country: string): University[] => {
  return universities.filter(uni => uni.country.toLowerCase() === country.toLowerCase());
};

export const searchUniversities = (query: string): University[] => {
  const lowercaseQuery = query.toLowerCase();
  return universities.filter(uni => 
    uni.name.toLowerCase().includes(lowercaseQuery) ||
    uni.country.toLowerCase().includes(lowercaseQuery) ||
    uni.city.toLowerCase().includes(lowercaseQuery) ||
    uni.programs.some(program => program.toLowerCase().includes(lowercaseQuery))
  );
};

export const getPremiumUniversities = (): University[] => {
  return universities.filter(uni => uni.isPremium);
};

export const getFreeUniversities = (): University[] => {
  return universities.filter(uni => !uni.isPremium);
};
