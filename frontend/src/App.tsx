import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardMedia,
  CardContent,
  Link,
  LinearProgress,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Alert,
  Snackbar,
  Fade,
  Zoom,
  keyframes,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  ArrowBackIos, 
  ArrowForwardIos, 
  CalendarToday, 
  DarkMode, 
  LightMode,
  PlayCircleOutline,
  Person,
  Security,
  Public,
  TrendingUp,
  Warning,
  AttachMoney
} from '@mui/icons-material';
import axios from 'axios';

// Define types
interface Article {
  title: string;
  text: string;
  url: string;
  image: string;
  publish_date: string;
}

interface YouTubeVideo {
  title: string;
  url: string;
  thumbnail: string;
  publish_date: string;
  channel: string;
}

interface Statistics {
  total_casualties: number;
  deaths: number;
  injuries: number;
  military_incidents: number;
  diplomatic_meetings: number;
  border_violations: number;
  economic_impact: number[];
  key_developments: number;
  recent_period: string;
  avg_casualties_per_incident: number;
  diplomatic_activity_level: string;
  conflict_intensity: string;
}

interface TrendingKeyword {
  text: string;
  weight: number;
  frequency: number;
}

interface GeographicHotspot {
  name: string;
  lat: number;
  lng: number;
  type: string;
  intensity: 'low' | 'medium' | 'high';
  incidents: number;
  description: string;
}

interface NewsData {
  summary: string;
  articles: Article[];
  images: string[];
  youtube_videos: YouTubeVideo[];
  statistics: Statistics;
  trending_keywords: TrendingKeyword[];
  geographic_hotspots: GeographicHotspot[];
}

interface ErrorResponse {
  error: string;
}

// Styled components with beautiful animations
const GradientBackground = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  minHeight: '100vh',
  background: darkMode ? `
    linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #0d4b0d 50%, #1b5e20 75%, #0a0a0a 100%),
    radial-gradient(circle at 20% 80%, #000000 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #1e3a1e 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, #2d4a2d 0%, transparent 50%)
  ` : `
    linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%),
    radial-gradient(circle at 20% 80%, #0d3f0d 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, #388e3c 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, #66bb6a 0%, transparent 50%)
  `,
  backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%',
  animation: `${keyframes`
    0% { background-position: 0% 50%, 0% 50%, 0% 50%, 0% 50%; }
    50% { background-position: 100% 50%, 100% 50%, 100% 50%, 100% 50%; }
    100% { background-position: 0% 50%, 0% 50%, 0% 50%, 0% 50%; }
  `} 15s ease infinite`,
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: darkMode ? `
      radial-gradient(circle at 25% 25%, rgba(76, 175, 80, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(46, 125, 50, 0.05) 0%, transparent 50%)
    ` : `
      radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: 'none',
  },
}));

const LoadingContainer = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  width: '100%',
  background: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '20px',
  padding: theme.spacing(4),
  margin: theme.spacing(2),
  boxShadow: darkMode 
    ? '0 8px 32px 0 rgba(76, 175, 50, 0.3)' 
    : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  border: darkMode 
    ? '1px solid rgba(76, 175, 50, 0.2)' 
    : '1px solid rgba(255, 255, 255, 0.18)',
}));

const GlassCard = styled(Paper)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  background: darkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: darkMode 
    ? '1px solid rgba(76, 175, 50, 0.3)' 
    : '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: darkMode 
    ? '0 8px 32px 0 rgba(76, 175, 50, 0.2)' 
    : '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: darkMode 
      ? '0 16px 48px 0 rgba(76, 175, 50, 0.4)' 
      : '0 16px 48px 0 rgba(31, 38, 135, 0.5)',
    background: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.15)',
  },
}));

const StyledCard = styled(Card)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  background: darkMode ? 'rgba(20, 20, 20, 0.9)' : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  border: darkMode 
    ? '1px solid rgba(76, 175, 50, 0.3)' 
    : '1px solid rgba(255, 255, 255, 0.3)',
  boxShadow: darkMode 
    ? '0 4px 16px 0 rgba(76, 175, 50, 0.2)' 
    : '0 4px 16px 0 rgba(31, 38, 135, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: darkMode 
      ? '0 20px 40px 0 rgba(76, 175, 50, 0.4)' 
      : '0 20px 40px 0 rgba(31, 38, 135, 0.4)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.1)',
    },
  },
}));

const YouTubeCard = styled(Card)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  background: darkMode ? 'rgba(20, 0, 0, 0.9)' : 'rgba(255, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '15px',
  border: darkMode 
    ? '1px solid rgba(255, 0, 0, 0.5)' 
    : '1px solid rgba(255, 0, 0, 0.3)',
  boxShadow: darkMode 
    ? '0 4px 16px 0 rgba(255, 0, 0, 0.3)' 
    : '0 4px 16px 0 rgba(255, 0, 0, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-10px) scale(1.02)',
    boxShadow: darkMode 
      ? '0 20px 40px 0 rgba(255, 0, 0, 0.5)' 
      : '0 20px 40px 0 rgba(255, 0, 0, 0.4)',
    '& .MuiCardMedia-root': {
      transform: 'scale(1.1)',
    },
  },
}));

const AnimatedTitle = styled(Typography)<{ component?: React.ElementType; darkMode?: boolean }>(({ theme, darkMode }) => ({
  background: darkMode 
    ? 'linear-gradient(45deg, #81c784, #4caf50, #81c784)'
    : 'linear-gradient(45deg, #fff, #e3f2fd, #fff)',
  backgroundSize: '200% 200%',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  animation: `${keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `} 3s ease infinite`,
  textShadow: darkMode ? '0 2px 4px rgba(76, 175, 80, 0.5)' : '0 2px 4px rgba(0,0,0,0.3)',
  fontWeight: 'bold',
  fontSize: '3rem',
}));

const CenteredProgressContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '500px',
  textAlign: 'center',
}));

const ProgressContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
  marginTop: theme.spacing(3),
  '& .MuiLinearProgress-root': {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    '& .MuiLinearProgress-bar': {
      borderRadius: '4px',
      background: 'linear-gradient(90deg, #4caf50, #66bb6a, #81c784)',
      backgroundSize: '200% 100%',
      animation: `${keyframes`
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      `} 2s linear infinite`,
    },
  },
}));

const DarkModeToggle = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
  background: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)',
  borderRadius: '50px',
  padding: theme.spacing(1),
  border: darkMode 
    ? '1px solid rgba(76, 175, 50, 0.3)' 
    : '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: darkMode 
    ? '0 4px 16px rgba(76, 175, 50, 0.2)' 
    : '0 4px 16px rgba(255, 255, 255, 0.2)',
}));

// 3D Carousel Components
const Carousel3DContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  height: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  perspective: '1000px',
  overflow: 'visible',
  margin: '0 auto',
  maxWidth: '1200px',
}));

const CarouselWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const CarouselSlide3D = styled(Box)<{ 
  index: number; 
  currentIndex: number; 
  totalSlides: number;
  isCenter: boolean;
}>(({ index, currentIndex, totalSlides, isCenter }) => {
  const offset = index - currentIndex;
  const absOffset = Math.abs(offset);
  
  return {
    position: 'absolute',
    width: isCenter ? '400px' : '250px',
    height: isCenter ? '250px' : '180px',
    borderRadius: '20px',
    overflow: 'hidden',
    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: `translateX(${offset * (isCenter ? 0 : 220)}px) translateZ(${isCenter ? 0 : -100}px) scale(${isCenter ? 1 : 0.8})`,
    opacity: absOffset > 2 ? 0 : isCenter ? 1 : 0.7,
    zIndex: isCenter ? 10 : 5 - absOffset,
    cursor: 'pointer',
    boxShadow: isCenter 
      ? '0 20px 60px rgba(0, 0, 0, 0.4)' 
      : '0 10px 30px rgba(0, 0, 0, 0.3)',
    filter: isCenter ? 'none' : 'brightness(0.8)',
    '&:hover': {
      transform: `translateX(${offset * (isCenter ? 0 : 220)}px) translateZ(${isCenter ? 10 : -90}px) scale(${isCenter ? 1.05 : 0.85})`,
    },
  };
});

const CarouselImage3D = styled('img')(({ theme }) => ({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  borderRadius: '20px',
}));

const CarouselNavButton = styled(IconButton)<{ direction: 'left' | 'right' }>(({ theme, direction }) => ({
  position: 'absolute',
  top: '50%',
  [direction]: '20px',
  transform: 'translateY(-50%)',
  zIndex: 20,
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  color: '#2e7d32',
  width: '60px',
  height: '60px',
  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.3)',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    transform: 'translateY(-50%) scale(1.1)',
  },
}));

const CarouselIndicators = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: '-50px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  gap: theme.spacing(1),
}));

const CarouselIndicator = styled(Box)<{ active: boolean }>(({ active, theme }) => ({
  width: 12,
  height: 12,
  borderRadius: '50%',
  backgroundColor: active ? '#4caf50' : 'rgba(255, 255, 255, 0.5)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: active ? '#66bb6a' : 'rgba(255, 255, 255, 0.8)',
    transform: 'scale(1.3)',
  },
}));

// Create enhanced themes
const createAppTheme = (darkMode: boolean) => createTheme({
  palette: {
    mode: darkMode ? 'dark' : 'light',
    primary: {
      main: darkMode ? '#4caf50' : '#4caf50',
      dark: darkMode ? '#2e7d32' : '#2e7d32',
      light: darkMode ? '#81c784' : '#81c784',
    },
    secondary: {
      main: darkMode ? '#66bb6a' : '#81c784',
    },
    background: {
      default: 'transparent',
      paper: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.1)',
    },
    text: {
      primary: darkMode ? '#e0e0e0' : '#ffffff',
      secondary: darkMode ? 'rgba(224, 224, 224, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    },
    error: {
      main: darkMode ? '#f44336' : '#d32f2f',
      light: darkMode ? '#ef5350' : '#f44336',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 700,
      fontSize: '3rem',
      color: darkMode ? '#e0e0e0' : '#ffffff',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: darkMode ? '#e0e0e0' : '#ffffff',
    },
    body1: {
      color: darkMode ? '#e0e0e0' : 'inherit',
    },
    body2: {
      color: darkMode ? '#b0b0b0' : 'inherit',
    },
  },
  shape: {
    borderRadius: 16,
  },
});

// Typewriter hook
const useTypewriter = (text: string, speed: number = 30) => {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) return;
    
    setDisplayText('');
    setIsComplete(false);
    let index = 0;
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayText, isComplete };
};

// 3D Carousel component
const ImageCarousel3D: React.FC<{ images: string[]; descriptions: string[] }> = ({ images, descriptions }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images.length) return null;

  return (
    <Carousel3DContainer>
      <CarouselWrapper>
        {images.map((image, index) => (
          <CarouselSlide3D
            key={index}
            index={index}
            currentIndex={currentIndex}
            totalSlides={images.length}
            isCenter={index === currentIndex}
            onClick={() => goToSlide(index)}
          >
            <CarouselImage3D
              src={image}
              alt={descriptions[index] || `Related content ${index + 1}`}
              onError={(e) => {
                console.error('Error loading image:', image);
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </CarouselSlide3D>
        ))}
        
        {images.length > 1 && (
          <>
            <CarouselNavButton direction="left" onClick={prevSlide}>
              <ArrowBackIos />
            </CarouselNavButton>
            <CarouselNavButton direction="right" onClick={nextSlide}>
              <ArrowForwardIos />
            </CarouselNavButton>
          </>
        )}
      </CarouselWrapper>
      
      {images.length > 1 && (
        <CarouselIndicators>
          {images.map((_, index) => (
            <CarouselIndicator
              key={index}
              active={index === currentIndex}
              onClick={() => goToSlide(index)}
            />
          ))}
        </CarouselIndicators>
      )}
    </Carousel3DContainer>
  );
};

const StatsCard = styled(Card)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  background: darkMode ? 'rgba(15, 15, 15, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: '20px',
  border: darkMode 
    ? '1px solid rgba(76, 175, 50, 0.4)' 
    : '1px solid rgba(76, 175, 50, 0.3)',
  boxShadow: darkMode 
    ? '0 8px 32px 0 rgba(76, 175, 50, 0.3)' 
    : '0 8px 32px 0 rgba(76, 175, 50, 0.2)',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: darkMode 
      ? '0 16px 48px 0 rgba(76, 175, 50, 0.5)' 
      : '0 16px 48px 0 rgba(76, 175, 50, 0.4)',
  },
}));

const StatItem = styled(Box)<{ darkMode: boolean }>(({ theme, darkMode }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(2),
  background: darkMode ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)',
  borderRadius: '15px',
  border: darkMode 
    ? '1px solid rgba(76, 175, 50, 0.2)' 
    : '1px solid rgba(76, 175, 50, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: darkMode ? 'rgba(76, 175, 50, 0.1)' : 'rgba(76, 175, 50, 0.1)',
    transform: 'scale(1.05)',
  },
}));

function App() {
  const [newsData, setNewsData] = useState<NewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [darkMode, setDarkMode] = useState(true);

  const theme = createAppTheme(darkMode);

  const { displayText: typedSummary, isComplete } = useTypewriter(
    newsData?.summary || '', 
    loading ? 0 : 25
  );

  // Generate image descriptions based on article content
  const generateImageDescriptions = (articles: Article[]): string[] => {
    const descriptions = [
      "Diplomatic meeting between regional leaders",
      "Security personnel monitoring border areas", 
      "Citizens gathering for peace demonstration",
      "Government officials in strategic discussion",
      "Military personnel maintaining frontier security",
      "International observers documenting events",
      "Community leaders addressing public concerns",
      "Emergency response teams in action"
    ];
    
    return descriptions.slice(0, newsData?.images.length || 0);
  };

  // Format date function
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Simulate progressive loading with realistic steps
        const steps = [
          { progress: 15, text: 'Connecting to news sources...' },
          { progress: 35, text: 'Fetching latest articles...' },
          { progress: 55, text: 'Searching YouTube videos...' },
          { progress: 75, text: 'Processing content...' },
          { progress: 90, text: 'Generating summary...' },
          { progress: 98, text: 'Finalizing...' },
        ];

        for (const step of steps) {
          setLoadingProgress(step.progress);
          setLoadingText(step.text);
          await new Promise(resolve => setTimeout(resolve, 800));
        }

        console.log('Fetching news data...');
        const response = await axios.get<NewsData | ErrorResponse>('http://localhost:5001/api/news');
        console.log('Response received:', response.data);

        if ('error' in response.data) {
          throw new Error(response.data.error);
        }

        setNewsData(response.data as NewsData);
        setError(null);
        setLoadingProgress(100);
        setLoadingText('Complete!');
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (err) {
        console.error('Error fetching news:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news data. Please try again later.';
        setError(errorMessage);
        setShowError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleCloseError = () => {
    setShowError(false);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GradientBackground darkMode={darkMode}>
          <LoadingContainer darkMode={darkMode}>
            <CenteredProgressContainer>
              <Zoom in={true} timeout={800}>
                <Box textAlign="center">
                  <AnimatedTitle variant="h4" gutterBottom darkMode={darkMode}>
                    India-Pakistan Conflict Update
                  </AnimatedTitle>
                  <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                    {loadingText}
                  </Typography>
                  <ProgressContainer>
                    <LinearProgress 
                      variant="determinate" 
                      value={loadingProgress}
                      sx={{ mb: 2 }}
                    />
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      {loadingProgress}% Complete
                    </Typography>
                  </ProgressContainer>
                </Box>
              </Zoom>
            </CenteredProgressContainer>
          </LoadingContainer>
        </GradientBackground>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GradientBackground darkMode={darkMode}>
        <DarkModeToggle darkMode={darkMode}>
          <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                icon={<LightMode />}
                checkedIcon={<DarkMode />}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#2e7d32',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#4caf50',
                  },
                }}
              />
            }
            label=""
          />
        </DarkModeToggle>

        <Snackbar open={showError} autoHideDuration={6000} onClose={handleCloseError}>
          <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Fade in={true} timeout={1000}>
            <Box>
              <AnimatedTitle variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 6 }} darkMode={darkMode}>
                India-Pakistan Conflict Update
              </AnimatedTitle>
              
              <Typography 
                variant="h6" 
                align="center" 
                sx={{ 
                  mb: 4, 
                  color: darkMode ? '#b0b0b0' : '#666',
                  fontStyle: 'italic',
                  fontWeight: 400,
                  opacity: 0.8
                }}
              >
                Coded by Burhan Mustafa
              </Typography>

              {error ? (
                <Zoom in={true} timeout={600}>
                  <GlassCard elevation={3} sx={{ p: 4, mb: 4, borderColor: 'error.main' }} darkMode={darkMode}>
                    <Typography variant="h6" color="error.light" gutterBottom>
                      Error
                    </Typography>
                    <Typography variant="body1" color="error.light">
                      {error}
                    </Typography>
                  </GlassCard>
                </Zoom>
              ) : (
                <>
                  {/* Summary Section with Typewriter Effect */}
                  <Fade in={true} timeout={1200}>
                    <GlassCard elevation={3} sx={{ p: 4, mb: 6 }} darkMode={darkMode}>
                      <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        Latest Developments
                      </Typography>
                      <Typography 
                        variant="body1" 
                        paragraph 
                        sx={{ 
                          fontSize: '1.1rem', 
                          lineHeight: 1.8,
                          position: 'relative',
                          color: darkMode ? '#e0e0e0' : 'text.primary',
                          '&::after': {
                            content: isComplete ? '""' : '"|"',
                            animation: isComplete ? 'none' : `${keyframes`
                              0%, 50% { opacity: 1; }
                              51%, 100% { opacity: 0; }
                            `} 1s infinite`,
                            marginLeft: '2px',
                          }
                        }}
                      >
                        {typedSummary}
                      </Typography>
                    </GlassCard>
                  </Fade>

                  {/* 3D Image Carousel */}
                  {newsData?.images && newsData.images.length > 0 && (
                    <Fade in={true} timeout={1400}>
                      <Box sx={{ mb: 8 }}>
                        <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 6, textAlign: 'center' }}>
                          Related Images
                        </Typography>
                        <ImageCarousel3D 
                          images={newsData.images} 
                          descriptions={generateImageDescriptions(newsData.articles)}
                        />
                      </Box>
                    </Fade>
                  )}

                  {/* Recent Articles */}
                  <Fade in={true} timeout={1600}>
                    <Box>
                      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 3, color: 'text.primary', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                        Recent Articles
                      </Typography>
                      <Box sx={{ 
                        display: 'grid', 
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
                        gap: 4 
                      }}>
                        {newsData?.articles.map((article, index) => (
                          <Zoom in={true} timeout={800 + index * 200} key={index}>
                            <StyledCard darkMode={darkMode}>
                              {article.image && (
                                <CardMedia
                                  component="img"
                                  height="200"
                                  image={article.image}
                                  alt={article.title}
                                  sx={{ 
                                    objectFit: 'cover',
                                    transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                  }}
                                  onError={(e) => {
                                    console.error('Error loading image:', article.image);
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              )}
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <CalendarToday sx={{ fontSize: 16, color: 'primary.main', mr: 1 }} />
                                  <Chip 
                                    label={formatDate(article.publish_date)}
                                    size="small"
                                    sx={{ 
                                      backgroundColor: 'rgba(76, 175, 80, 0.1)',
                                      color: 'primary.dark',
                                      fontWeight: 'bold',
                                      fontSize: '0.75rem'
                                    }}
                                  />
                                </Box>
                                <Typography variant="h6" gutterBottom sx={{ 
                                  fontWeight: 'bold', 
                                  color: darkMode ? '#e0e0e0' : '#1b5e20' 
                                }}>
                                  {article.title}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: darkMode ? '#b0b0b0' : '#2e2e2e', 
                                  mb: 2 
                                }}>
                                  {article.text.substring(0, 200)}...
                                </Typography>
                                <Link 
                                  href={article.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  sx={{
                                    color: 'primary.dark',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    position: 'relative',
                                    '&:hover': {
                                      color: 'primary.main',
                                      '&::after': {
                                        width: '100%',
                                      }
                                    },
                                    '&::after': {
                                      content: '""',
                                      position: 'absolute',
                                      bottom: '-2px',
                                      left: 0,
                                      width: '0%',
                                      height: '2px',
                                      background: 'linear-gradient(90deg, #4caf50, #66bb6a)',
                                      transition: 'width 0.3s ease',
                                    }
                                  }}
                                >
                                  Read more →
                                </Link>
                              </CardContent>
                            </StyledCard>
                          </Zoom>
                        ))}
                      </Box>
                    </Box>
                  </Fade>

                  {/* YouTube Videos Section */}
                  {newsData?.youtube_videos && newsData.youtube_videos.length > 0 && (
                    <Fade in={true} timeout={1800}>
                      <Box sx={{ mt: 8 }}>
                        <Typography variant="h5" gutterBottom sx={{ color: 'text.primary', textShadow: '0 2px 4px rgba(0,0,0,0.3)', mb: 4 }}>
                          Related Videos (Last 4 Days)
                        </Typography>
                        <Box sx={{ 
                          display: 'grid', 
                          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, 
                          gap: 3 
                        }}>
                          {newsData.youtube_videos.map((video, index) => (
                            <Zoom in={true} timeout={800 + index * 150} key={index}>
                              <YouTubeCard darkMode={darkMode}>
                                <Box sx={{ position: 'relative' }}>
                                  <CardMedia
                                    component="img"
                                    height="180"
                                    image={video.thumbnail}
                                    alt={video.title}
                                    sx={{ 
                                      objectFit: 'cover',
                                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    }}
                                    onError={(e) => {
                                      console.error('Error loading YouTube thumbnail:', video.thumbnail);
                                      // Try alternative thumbnail sizes
                                      const videoId = video.url.split('v=')[1]?.split('&')[0];
                                      if (videoId) {
                                        const target = e.target as HTMLImageElement;
                                        if (target.src.includes('maxresdefault')) {
                                          target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                        } else if (target.src.includes('hqdefault')) {
                                          target.src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
                                        } else {
                                          target.style.display = 'none';
                                        }
                                      }
                                    }}
                                  />
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      color: 'white',
                                      fontSize: '3rem',
                                      opacity: 0.9,
                                      transition: 'opacity 0.3s ease',
                                      '&:hover': { opacity: 1 }
                                    }}
                                  >
                                    <PlayCircleOutline fontSize="inherit" />
                                  </Box>
                                </Box>
                                <CardContent sx={{ p: 2 }}>
                                  <Typography variant="body2" sx={{ 
                                    color: darkMode ? '#888' : '#666', 
                                    mb: 1, 
                                    fontSize: '0.75rem' 
                                  }}>
                                    {video.channel} • {formatDate(video.publish_date)}
                                  </Typography>
                                  <Typography variant="h6" gutterBottom sx={{ 
                                    fontWeight: 'bold', 
                                    color: darkMode ? '#e0e0e0' : '#1b5e20',
                                    fontSize: '0.9rem',
                                    lineHeight: 1.3,
                                    overflow: 'hidden',
                                    display: '-webkit-box',
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                  }}>
                                    {video.title}
                                  </Typography>
                                  <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<PlayCircleOutline />}
                                    href={video.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      backgroundColor: '#ff0000',
                                      color: 'white',
                                      fontSize: '0.75rem',
                                      mt: 1,
                                      '&:hover': {
                                        backgroundColor: '#cc0000',
                                      }
                                    }}
                                  >
                                    Watch
                                  </Button>
                                </CardContent>
                              </YouTubeCard>
                            </Zoom>
                          ))}
                        </Box>
                      </Box>
                    </Fade>
                  )}

                  {/* Real-Time News Ticker */}
                  <Fade in={true} timeout={1800}>
                    <GlassCard elevation={3} sx={{ p: 3, mb: 4, overflow: 'hidden' }} darkMode={darkMode}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ 
                          width: 12, 
                          height: 12, 
                          borderRadius: '50%', 
                          backgroundColor: '#4caf50',
                          animation: 'pulse 2s infinite',
                          mr: 2,
                          '@keyframes pulse': {
                            '0%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0.7)' },
                            '70%': { boxShadow: '0 0 0 10px rgba(76, 175, 80, 0)' },
                            '100%': { boxShadow: '0 0 0 0 rgba(76, 175, 80, 0)' }
                          }
                        }} />
                        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                          🔴 LIVE: Breaking Updates
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        backgroundColor: darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(27, 94, 32, 0.1)',
                        borderRadius: 2,
                        p: 2,
                        border: `1px solid ${darkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(27, 94, 32, 0.3)'}`,
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        <Typography variant="body1" sx={{ 
                          color: 'text.primary',
                          fontWeight: 500,
                          lineHeight: 1.6,
                          position: 'relative',
                          zIndex: 1
                        }}>
                          📡 {newsData?.articles?.length || 0} new articles detected • 
                          🎥 {newsData?.youtube_videos?.length || 0} video sources analyzed • 
                          ⚡ Real-time monitoring active • 
                          🌍 Sources: BBC, Al Jazeera, Reuters
                        </Typography>
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(76, 175, 80, 0.2), transparent)',
                          animation: 'slide 3s infinite',
                          '@keyframes slide': {
                            '0%': { left: '-100%' },
                            '100%': { left: '100%' }
                          }
                        }} />
                      </Box>
                    </GlassCard>
                  </Fade>

                  {/* Statistics Section */}
                  <Fade in={true} timeout={2000}>
                    <Box sx={{ mt: 8 }}>
                      <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" gutterBottom sx={{ 
                          color: 'primary.main', 
                          fontWeight: 'bold',
                          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                          mb: 1
                        }}>
                          📊 Stats for This Week
                        </Typography>
                        <Typography variant="subtitle1" sx={{ 
                          color: 'text.secondary', 
                          fontStyle: 'italic',
                          opacity: 0.8
                        }}>
                          Conflict Analysis • Last {newsData?.statistics?.recent_period || '7 days'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                        <StatsCard elevation={3} darkMode={darkMode}>
                          <CardContent>
                            <StatItem darkMode={darkMode}>
                              <Person sx={{ fontSize: '2rem', color: darkMode ? '#ff6b6b' : '#d32f2f', mr: 2 }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: darkMode ? '#ff6b6b' : '#d32f2f', fontWeight: 'bold' }}>
                                  {newsData?.statistics?.deaths || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Deaths Reported
                                </Typography>
                              </Box>
                            </StatItem>
                            <StatItem darkMode={darkMode}>
                              <Warning sx={{ fontSize: '2rem', color: darkMode ? '#ffa726' : '#f57c00', mr: 2 }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: darkMode ? '#ffa726' : '#f57c00', fontWeight: 'bold' }}>
                                  {newsData?.statistics?.injuries || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Injuries Reported
                                </Typography>
                              </Box>
                            </StatItem>
                            <StatItem darkMode={darkMode}>
                              <Security sx={{ fontSize: '2rem', color: darkMode ? '#66bb6a' : '#388e3c', mr: 2 }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: darkMode ? '#66bb6a' : '#388e3c', fontWeight: 'bold' }}>
                                  {newsData?.statistics?.military_incidents || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Military Incidents
                                </Typography>
                              </Box>
                            </StatItem>
                          </CardContent>
                        </StatsCard>
                        
                        <StatsCard elevation={3} darkMode={darkMode}>
                          <CardContent>
                            <StatItem darkMode={darkMode}>
                              <Public sx={{ fontSize: '2rem', color: darkMode ? '#42a5f5' : '#1976d2', mr: 2 }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: darkMode ? '#42a5f5' : '#1976d2', fontWeight: 'bold' }}>
                                  {newsData?.statistics?.diplomatic_meetings || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Diplomatic Activities
                                </Typography>
                              </Box>
                            </StatItem>
                            <StatItem darkMode={darkMode}>
                              <TrendingUp sx={{ fontSize: '2rem', color: darkMode ? '#ab47bc' : '#7b1fa2', mr: 2 }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: darkMode ? '#ab47bc' : '#7b1fa2', fontWeight: 'bold' }}>
                                  {newsData?.statistics?.border_violations || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Border Incidents
                                </Typography>
                              </Box>
                            </StatItem>
                            <StatItem darkMode={darkMode}>
                              <AttachMoney sx={{ fontSize: '2rem', color: darkMode ? '#ffca28' : '#f9a825', mr: 2 }} />
                              <Box>
                                <Typography variant="h6" sx={{ color: darkMode ? '#ffca28' : '#f9a825', fontWeight: 'bold' }}>
                                  {newsData?.statistics?.key_developments || 0}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  Key Developments
                                </Typography>
                              </Box>
                            </StatItem>
                          </CardContent>
                        </StatsCard>
                      </Box>
                      
                      {/* Conflict Intensity Indicator */}
                      <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Chip 
                          label={`Conflict Intensity: ${newsData?.statistics?.conflict_intensity || 'Unknown'}`}
                          color={
                            newsData?.statistics?.conflict_intensity === 'High' ? 'error' : 
                            newsData?.statistics?.conflict_intensity === 'Moderate' ? 'warning' : 'success'
                          }
                          sx={{ 
                            fontSize: '1rem', 
                            fontWeight: 'bold',
                            py: 1,
                            px: 2
                          }}
                        />
                        <Chip 
                          label={`Diplomatic Activity: ${newsData?.statistics?.diplomatic_activity_level || 'Unknown'}`}
                          color={
                            newsData?.statistics?.diplomatic_activity_level === 'High' ? 'success' : 
                            newsData?.statistics?.diplomatic_activity_level === 'Moderate' ? 'info' : 'default'
                          }
                          sx={{ 
                            fontSize: '1rem', 
                            fontWeight: 'bold',
                            py: 1,
                            px: 2,
                            ml: 2
                          }}
                        />
                      </Box>
                    </Box>
                  </Fade>

                  {/* Recent Developments Timeline */}
                  <Fade in={true} timeout={2200}>
                    <Box sx={{ mt: 6 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        color: 'primary.main', 
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 4
                      }}>
                        🕒 Recent Developments Timeline
                      </Typography>
                      <GlassCard elevation={3} sx={{ p: 4 }} darkMode={darkMode}>
                        <Box sx={{ position: 'relative' }}>
                          {newsData?.articles?.slice(0, 4).map((article, index) => (
                            <Box key={index} sx={{ 
                              display: 'flex', 
                              alignItems: 'flex-start', 
                              mb: index < 3 ? 4 : 0,
                              position: 'relative'
                            }}>
                              {/* Timeline Line */}
                              {index < 3 && (
                                <Box sx={{
                                  position: 'absolute',
                                  left: '15px',
                                  top: '30px',
                                  width: '2px',
                                  height: '60px',
                                  background: `linear-gradient(to bottom, ${darkMode ? '#4caf50' : '#2e7d32'}, transparent)`,
                                  opacity: 0.6
                                }} />
                              )}
                              
                              {/* Timeline Dot */}
                              <Box sx={{
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                background: `linear-gradient(135deg, ${darkMode ? '#4caf50' : '#2e7d32'}, ${darkMode ? '#66bb6a' : '#4caf50'})`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                mr: 3,
                                position: 'relative',
                                zIndex: 1,
                                boxShadow: `0 0 20px ${darkMode ? 'rgba(76, 175, 80, 0.5)' : 'rgba(46, 125, 50, 0.5)'}`,
                                animation: `pulse 2s infinite ${index * 0.5}s`,
                              }}>
                                <Typography variant="caption" sx={{ 
                                  color: 'white', 
                                  fontWeight: 'bold',
                                  fontSize: '0.7rem'
                                }}>
                                  {index + 1}
                                </Typography>
                              </Box>
                               
                              {/* Content */}
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="body2" sx={{ 
                                  color: 'text.secondary', 
                                  mb: 0.5,
                                  fontSize: '0.85rem'
                                }}>
                                  {formatDate(article.publish_date)}
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                  color: 'text.primary',
                                  fontWeight: 600,
                                  lineHeight: 1.4,
                                  mb: 1
                                }}>
                                  {article.title}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: 'text.secondary',
                                  lineHeight: 1.5,
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden'
                                }}>
                                  {article.text.substring(0, 150)}...
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      </GlassCard>
                    </Box>
                  </Fade>

                  {/* Trending Keywords Cloud */}
                  <Fade in={true} timeout={2400}>
                    <Box sx={{ mt: 6 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        color: 'primary.main', 
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 4
                      }}>
                        ☁️ Trending Keywords Cloud
                      </Typography>
                      <GlassCard elevation={3} sx={{ p: 4, position: 'relative', overflow: 'hidden' }} darkMode={darkMode}>
                        {/* Background Pattern */}
                        <Box sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `radial-gradient(circle at 20% 30%, ${darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(25, 118, 210, 0.05)'} 0%, transparent 50%), 
                                      radial-gradient(circle at 80% 70%, ${darkMode ? 'rgba(255, 193, 7, 0.1)' : 'rgba(255, 152, 0, 0.05)'} 0%, transparent 50%)`,
                          pointerEvents: 'none'
                        }} />
                        
                        <Box sx={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 2, 
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          {newsData?.trending_keywords?.map((keyword, index) => {
                            // Calculate font size based on weight (12px to 36px)
                            const fontSize = Math.max(12, Math.min(36, (keyword.weight / 100) * 24 + 12));
                            
                            // Color based on weight and type
                            const getKeywordColor = () => {
                              if (keyword.weight > 80) return darkMode ? '#ff6b6b' : '#d32f2f'; // High importance - red
                              if (keyword.weight > 60) return darkMode ? '#ffa726' : '#f57c00'; // Medium-high - orange
                              if (keyword.weight > 40) return darkMode ? '#ffca28' : '#f9a825'; // Medium - yellow
                              if (keyword.weight > 20) return darkMode ? '#66bb6a' : '#388e3c'; // Low-medium - green
                              return darkMode ? '#42a5f5' : '#1976d2'; // Low - blue
                            };
                            
                            return (
                              <Box
                                key={index}
                                sx={{
                                  padding: '8px 16px',
                                  borderRadius: '20px',
                                  background: `linear-gradient(135deg, ${getKeywordColor()}15, ${getKeywordColor()}25)`,
                                  border: `2px solid ${getKeywordColor()}40`,
                                  cursor: 'pointer',
                                  transition: 'all 0.3s ease',
                                  animation: `fadeInUp 0.6s ease ${index * 0.1}s both`,
                                  '&:hover': {
                                    transform: 'scale(1.1) rotate(2deg)',
                                    background: `linear-gradient(135deg, ${getKeywordColor()}25, ${getKeywordColor()}35)`,
                                    boxShadow: `0 8px 25px ${getKeywordColor()}30`,
                                    zIndex: 10
                                  },
                                  '@keyframes fadeInUp': {
                                    '0%': {
                                      opacity: 0,
                                      transform: 'translateY(30px) scale(0.8)'
                                    },
                                    '100%': {
                                      opacity: 1,
                                      transform: 'translateY(0) scale(1)'
                                    }
                                  }
                                }}
                              >
                                <Typography 
                                  sx={{ 
                                    fontSize: `${fontSize}px`,
                                    fontWeight: Math.min(800, 400 + (keyword.weight / 100) * 400),
                                    color: getKeywordColor(),
                                    textShadow: `0 2px 4px ${getKeywordColor()}20`,
                                    lineHeight: 1.2,
                                    userSelect: 'none'
                                  }}
                                >
                                  {keyword.text}
                                </Typography>
                                <Typography 
                                  variant="caption" 
                                  sx={{ 
                                    display: 'block',
                                    textAlign: 'center',
                                    color: 'text.secondary',
                                    fontSize: '10px',
                                    mt: 0.5,
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                    '.MuiBox-root:hover &': {
                                      opacity: 1
                                    }
                                  }}
                                >
                                  {keyword.frequency} mentions
                                </Typography>
                              </Box>
                            );
                          })}
                        </Box>
                        
                        {/* Floating particles animation */}
                        {[...Array(5)].map((_, i) => (
                          <Box
                            key={i}
                            sx={{
                              position: 'absolute',
                              width: '4px',
                              height: '4px',
                              borderRadius: '50%',
                              background: darkMode ? '#4caf50' : '#1976d2',
                              opacity: 0.3,
                              animation: `float${i} ${4 + i}s infinite ease-in-out`,
                              left: `${20 + i * 15}%`,
                              top: `${20 + i * 10}%`,
                              [`@keyframes float${i}`]: {
                                '0%, 100%': { transform: 'translateY(0px) scale(1)' },
                                '50%': { transform: `translateY(-${10 + i * 5}px) scale(1.2)` }
                              }
                            }}
                          />
                        ))}
                      </GlassCard>
                    </Box>
                  </Fade>

                  {/* Geographic Hotspot Map */}
                  <Fade in={true} timeout={2600}>
                    <Box sx={{ mt: 6 }}>
                      <Typography variant="h5" gutterBottom sx={{ 
                        color: 'primary.main', 
                        fontWeight: 'bold',
                        textAlign: 'center',
                        mb: 4
                      }}>
                        🗺️ Geographic Hotspot Map
                      </Typography>
                      <GlassCard elevation={3} sx={{ p: 4, position: 'relative' }} darkMode={darkMode}>
                        {/* SVG Map Container */}
                        <Box sx={{ 
                          position: 'relative',
                          height: '400px',
                          background: `linear-gradient(135deg, ${darkMode ? '#1a1a2e' : '#f5f5f5'}, ${darkMode ? '#16213e' : '#e3f2fd'})`,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          border: `2px solid ${darkMode ? '#333' : '#ddd'}`
                        }}>
                          {/* Simplified SVG Map of India-Pakistan Region */}
                          <svg
                            viewBox="0 0 800 400"
                            style={{ width: '100%', height: '100%', position: 'absolute' }}
                          >
                            {/* Background grid */}
                            <defs>
                              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={darkMode ? '#333' : '#e0e0e0'} strokeWidth="0.5" opacity="0.3"/>
                              </pattern>
                            </defs>
                            <rect width="800" height="400" fill="url(#grid)" />
                            
                            {/* Simplified India shape */}
                            <path
                              d="M 400 50 L 500 80 L 580 120 L 620 180 L 600 250 L 580 320 L 520 350 L 460 340 L 420 320 L 380 280 L 360 220 L 370 160 L 380 100 Z"
                              fill={darkMode ? '#4caf5030' : '#2196f330'}
                              stroke={darkMode ? '#4caf50' : '#2196f3'}
                              strokeWidth="2"
                            />
                            
                            {/* Simplified Pakistan shape */}
                            <path
                              d="M 200 70 L 300 60 L 370 100 L 380 160 L 360 220 L 320 260 L 280 280 L 240 270 L 200 250 L 180 200 L 190 150 L 200 100 Z"
                              fill={darkMode ? '#ff981f30' : '#ff572230'}
                              stroke={darkMode ? '#ff981f' : '#ff5722'}
                              strokeWidth="2"
                            />
                            
                            {/* Kashmir disputed region */}
                            <path
                              d="M 320 80 L 380 70 L 400 90 L 390 120 L 360 130 L 330 120 Z"
                              fill={darkMode ? '#f4433630' : '#e9396330'}
                              stroke={darkMode ? '#f44336' : '#e91e63'}
                              strokeWidth="2"
                              strokeDasharray="5,5"
                            />
                            
                            {/* Country Labels */}
                            <text x="200" y="200" fill={darkMode ? '#ff981f' : '#ff5722'} fontSize="18" fontWeight="bold" textAnchor="middle">PAKISTAN</text>
                            <text x="500" y="220" fill={darkMode ? '#4caf50' : '#2196f3'} fontSize="18" fontWeight="bold" textAnchor="middle">INDIA</text>
                            <text x="350" y="105" fill={darkMode ? '#f44336' : '#e91e63'} fontSize="14" fontWeight="bold" textAnchor="middle">KASHMIR</text>
                            
                            {/* LOC (Line of Control) */}
                            <line x1="320" y1="80" x2="380" y2="160" stroke={darkMode ? '#ffeb3b' : '#ff9800'} strokeWidth="3" strokeDasharray="10,5" />
                            <text x="340" y="130" fill={darkMode ? '#ffeb3b' : '#ff9800'} fontSize="12" fontWeight="bold">LOC</text>
                          </svg>
                          
                          {/* Hotspot Markers */}
                          {newsData?.geographic_hotspots?.map((hotspot, index) => {
                            // Convert lat/lng to SVG coordinates (simplified mapping)
                            const x = ((hotspot.lng - 65) / (80 - 65)) * 800;
                            const y = ((35 - hotspot.lat) / (35 - 25)) * 400;
                            
                            const getIntensityColor = () => {
                              switch (hotspot.intensity) {
                                case 'high': return '#ff1744';
                                case 'medium': return '#ff9800';
                                case 'low': return '#4caf50';
                                default: return '#2196f3';
                              }
                            };
                            
                            const getMarkerSize = () => {
                              switch (hotspot.intensity) {
                                case 'high': return 20;
                                case 'medium': return 16;
                                case 'low': return 12;
                                default: return 10;
                              }
                            };
                            
                            return (
                              <Box
                                key={index}
                                sx={{
                                  position: 'absolute',
                                  left: `${x}px`,
                                  top: `${y}px`,
                                  transform: 'translate(-50%, -50%)',
                                  cursor: 'pointer',
                                  zIndex: 10
                                }}
                              >
                                {/* Pulsing marker */}
                                <Box
                                  sx={{
                                    width: `${getMarkerSize()}px`,
                                    height: `${getMarkerSize()}px`,
                                    borderRadius: '50%',
                                    background: getIntensityColor(),
                                    position: 'relative',
                                    animation: `pulse${index} 2s infinite`,
                                    boxShadow: `0 0 15px ${getIntensityColor()}60`,
                                    [`@keyframes pulse${index}`]: {
                                      '0%': { 
                                        transform: 'scale(1)',
                                        opacity: 1
                                      },
                                      '50%': { 
                                        transform: 'scale(1.3)',
                                        opacity: 0.7
                                      },
                                      '100%': { 
                                        transform: 'scale(1)',
                                        opacity: 1
                                      }
                                    },
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      width: `${getMarkerSize() * 2}px`,
                                      height: `${getMarkerSize() * 2}px`,
                                      borderRadius: '50%',
                                      background: `${getIntensityColor()}20`,
                                      animation: `ripple${index} 3s infinite`,
                                    },
                                    [`@keyframes ripple${index}`]: {
                                      '0%': {
                                        transform: 'translate(-50%, -50%) scale(0)',
                                        opacity: 1
                                      },
                                      '100%': {
                                        transform: 'translate(-50%, -50%) scale(1)',
                                        opacity: 0
                                      }
                                    }
                                  }}
                                />
                                
                                {/* Tooltip */}
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    bottom: '25px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: darkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)',
                                    color: darkMode ? 'white' : 'black',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    fontSize: '12px',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                    pointerEvents: 'none',
                                    zIndex: 20,
                                    border: `1px solid ${getIntensityColor()}`,
                                    '&::after': {
                                      content: '""',
                                      position: 'absolute',
                                      top: '100%',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      border: '6px solid transparent',
                                      borderTopColor: darkMode ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)'
                                    },
                                    '.hotspot-marker:hover &': {
                                      opacity: 1
                                    }
                                  }}
                                  className="hotspot-tooltip"
                                >
                                  <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block' }}>
                                    {hotspot.name}
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', color: getIntensityColor() }}>
                                    {hotspot.intensity.toUpperCase()} Activity
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>
                                    {hotspot.incidents} incidents
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })}
                          
                          {/* Legend */}
                          <Box sx={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)',
                            padding: '12px',
                            borderRadius: '8px',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${darkMode ? '#333' : '#ddd'}`
                          }}>
                            <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', mb: 1 }}>
                              Activity Level
                            </Typography>
                            {[
                              { level: 'High', color: '#ff1744' },
                              { level: 'Medium', color: '#ff9800' },
                              { level: 'Low', color: '#4caf50' }
                            ].map((item) => (
                              <Box key={item.level} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <Box sx={{
                                  width: '12px',
                                  height: '12px',
                                  borderRadius: '50%',
                                  background: item.color,
                                  mr: 1
                                }} />
                                <Typography variant="caption" sx={{ fontSize: '11px' }}>
                                  {item.level}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        </Box>
                        
                        {/* Activity Summary */}
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                          {['high', 'medium', 'low'].map((intensity) => {
                            const count = newsData?.geographic_hotspots?.filter(h => h.intensity === intensity).length || 0;
                            const color = intensity === 'high' ? '#ff1744' : intensity === 'medium' ? '#ff9800' : '#4caf50';
                            
                            return (
                              <Chip
                                key={intensity}
                                label={`${intensity.charAt(0).toUpperCase() + intensity.slice(1)} Activity: ${count} areas`}
                                sx={{
                                  background: `${color}20`,
                                  color: color,
                                  border: `1px solid ${color}`,
                                  fontWeight: 'bold'
                                }}
                              />
                            );
                          })}
                        </Box>
                      </GlassCard>
                    </Box>
                  </Fade>
                </>
              )}
            </Box>
          </Fade>
        </Container>
      </GradientBackground>
    </ThemeProvider>
  );
}

export default App;