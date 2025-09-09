// AI Prayer Generation API service using OpenAI
import { apiClient, isMockMode, handleAPIError, APIError } from './api.js';
import { ENV } from './environment.js';

/**
 * AI Prayer API endpoints
 */
const AI_PRAYER_ENDPOINTS = {
  GENERATE_PRAYER: '/api/ai/generate-prayer',
  PRAYER_SUGGESTIONS: '/api/ai/prayer-suggestions',
  PRAYER_TEMPLATES: '/api/ai/prayer-templates',
};

/**
 * Prayer generation validation schemas
 */
export const AIPrayerSchema = {
  generatePrayer: {
    eventTitle: { required: true, maxLength: 200 },
    eventDescription: { required: true, maxLength: 500 },
    eventCategory: { required: true },
    prayerType: { required: false, default: 'healing' },
    tone: { required: false, default: 'compassionate' },
  },
  userDetails: {
    userName: { required: true, minLength: 2, maxLength: 50 },
    email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    age: { required: true, min: 13, max: 120 },
    location: { required: true, minLength: 2, maxLength: 100 },
  },
};

/**
 * Prayer types and tones
 */
export const PRAYER_OPTIONS = {
  types: ['healing', 'peace', 'strength', 'hope', 'comfort', 'guidance'],
  tones: ['compassionate', 'hopeful', 'peaceful', 'uplifting', 'gentle', 'powerful'],
};

/**
 * Validate prayer generation data
 */
const validatePrayerData = (data, schema) => {
  const errors = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push(`${field} is required`);
      continue;
    }
    
    if (value) {
      if (rules.minLength && value.toString().length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
      
      if (rules.maxLength && value.toString().length > rules.maxLength) {
        errors.push(`${field} must be ${rules.maxLength} characters or less`);
      }
      
      if (rules.min && parseInt(value) < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }
      
      if (rules.max && parseInt(value) > rules.max) {
        errors.push(`${field} must be ${rules.max} or less`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} format is invalid`);
      }
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Validation failed: ${errors.join(', ')}`);
  }
  
  return true;
};

/**
 * Mock AI prayer generation for development
 */
const mockAIPrayerAPI = {
  async generatePrayer(eventData, prayerOptions = {}) {
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate AI processing time
    
    const prayerTemplates = {
      healing: [
        `May those affected by ${eventData.eventTitle} find healing and strength. Grant them comfort in their time of need and surround them with love and support. Let healing energy flow to all who are suffering.`,
        `We pray for complete healing and restoration for everyone impacted by ${eventData.eventTitle}. May they find peace in the midst of chaos and hope for a brighter tomorrow.`,
      ],
      peace: [
        `We pray for peace in the midst of ${eventData.eventTitle}. May understanding replace conflict, compassion overcome hatred, and unity prevail where there is division.`,
        `Grant us the wisdom to find peaceful solutions to the challenges brought by ${eventData.eventTitle}. Let peace reign in hearts and communities.`,
      ],
      strength: [
        `Give strength to all those facing the challenges of ${eventData.eventTitle}. May they find courage to overcome obstacles and resilience to keep moving forward.`,
        `We ask for divine strength for everyone affected by ${eventData.eventTitle}. Help them stay strong and support one another through difficult times.`,
      ],
      hope: [
        `In the face of ${eventData.eventTitle}, we hold onto hope. May this situation lead to positive change and renewed faith in humanity's capacity for good.`,
        `Let hope shine bright despite the darkness of ${eventData.eventTitle}. May we find reasons to believe in a better future for all.`,
      ],
    };
    
    const selectedType = prayerOptions.prayerType || 'healing';
    const templates = prayerTemplates[selectedType] || prayerTemplates.healing;
    const selectedTemplate = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      data: {
        id: `ai-prayer-${Date.now()}`,
        generatedPrayer: selectedTemplate,
        eventId: eventData.eventId,
        eventTitle: eventData.eventTitle,
        prayerType: selectedType,
        tone: prayerOptions.tone || 'compassionate',
        generatedAt: new Date().toISOString(),
        isAIGenerated: true,
      },
    };
  },

  async getPrayerSuggestions(eventCategory) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const suggestions = {
      Health: ['healing', 'comfort', 'strength'],
      Environment: ['hope', 'guidance', 'healing'],
      Social: ['peace', 'unity', 'understanding'],
      Politics: ['wisdom', 'peace', 'guidance'],
      Technology: ['guidance', 'wisdom', 'responsibility'],
      default: ['hope', 'peace', 'strength'],
    };
    
    return {
      data: suggestions[eventCategory] || suggestions.default,
    };
  },

  async generateShortPrayer(eventData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const shortPrayerTemplates = [
      `${eventData.eventTitle.split(' ').slice(0, 3).join(' ')} and all affected`,
      `Peace and healing for ${eventData.location}`,
      `Those impacted by ${eventData.category.toLowerCase()} challenges`,
      `Unity and strength in ${eventData.location}`,
      `Healing for all touched by this ${eventData.category.toLowerCase()} event`,
    ];
    
    // Select template based on category
    let selectedTemplate;
    if (eventData.category === 'Natural Disaster') {
      selectedTemplate = `healing and recovery for ${eventData.location}`;
    } else if (eventData.category === 'Health') {
      selectedTemplate = `healing and strength for all affected`;
    } else if (eventData.category === 'Environment') {
      selectedTemplate = `environmental healing and global cooperation`;
    } else {
      selectedTemplate = shortPrayerTemplates[Math.floor(Math.random() * shortPrayerTemplates.length)];
    }
    
    return {
      data: {
        shortPrayer: selectedTemplate,
        eventId: eventData.id,
        eventTitle: eventData.eventTitle,
        generatedAt: new Date().toISOString(),
      },
    };
  },
};

/**
 * AI Prayer API Service
 */
export const aiPrayerAPI = {
  /**
   * Generate AI prayer based on event details
   */
  async generatePrayer(eventData, prayerOptions = {}) {
    if (!eventData) {
      throw new Error('Event data is required for prayer generation');
    }

    if (isMockMode()) {
      validatePrayerData(eventData, AIPrayerSchema.generatePrayer);
      return mockAIPrayerAPI.generatePrayer(eventData, prayerOptions);
    }

    try {
      validatePrayerData(eventData, AIPrayerSchema.generatePrayer);
      
      const requestData = {
        eventTitle: eventData.eventTitle,
        eventDescription: eventData.eventDescription,
        eventCategory: eventData.eventCategory,
        prayerType: prayerOptions.prayerType || 'healing',
        tone: prayerOptions.tone || 'compassionate',
      };
      
      const response = await apiClient.post(AI_PRAYER_ENDPOINTS.GENERATE_PRAYER, requestData);
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to generate AI prayer');
      throw errorInfo;
    }
  },

  /**
   * Get prayer type suggestions based on event category
   */
  async getPrayerSuggestions(eventCategory) {
    if (!eventCategory) {
      throw new Error('Event category is required');
    }

    if (isMockMode()) {
      return mockAIPrayerAPI.getPrayerSuggestions(eventCategory);
    }

    try {
      const response = await apiClient.get(AI_PRAYER_ENDPOINTS.PRAYER_SUGGESTIONS, {
        category: eventCategory,
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch prayer suggestions');
      throw errorInfo;
    }
  },

  /**
   * Get prayer templates for a specific type
   */
  async getPrayerTemplates(prayerType = 'healing') {
    if (isMockMode()) {
      return mockAIPrayerAPI.getPrayerTemplates(prayerType);
    }

    try {
      const response = await apiClient.get(AI_PRAYER_ENDPOINTS.PRAYER_TEMPLATES, {
        type: prayerType,
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to fetch prayer templates');
      throw errorInfo;
    }
  },

  /**
   * Validate user details for prayer submission
   */
  validateUserDetails(userDetails) {
    return validatePrayerData(userDetails, AIPrayerSchema.userDetails);
  },

  /**
   * Generate short prayer text for globe display
   */
  async generateShortPrayer(eventData) {
    if (isMockMode()) {
      return mockAIPrayerAPI.generateShortPrayer(eventData);
    }

    try {
      const response = await apiClient.post('/api/ai/generate-short-prayer', {
        eventId: eventData.id,
        eventTitle: eventData.eventTitle,
        eventCategory: eventData.category,
        location: eventData.location,
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to generate short prayer');
      throw errorInfo;
    }
  },

  /**
   * Generate global prayer for globe display
   */
  async generateGlobalPrayer(eventData, maxLength = 50) {
    const validationErrors = validatePrayerData(
      { eventTitle: eventData.eventTitle, eventCategory: eventData.category },
      { eventTitle: AIPrayerSchema.generatePrayer.eventTitle, eventCategory: AIPrayerSchema.generatePrayer.eventCategory }
    );

    if (validationErrors.length > 0) {
      throw new APIError('Validation failed', 400, { errors: validationErrors });
    }

    if (isMockMode()) {
      // Mock short global prayer
      const mockShortPrayer = {
        id: `global_prayer_${eventData.id}`,
        eventId: eventData.id,
        shortPrayer: `${eventData.location} needs our prayers`,
        fullPrayer: `May peace and healing reach all those affected by ${eventData.eventTitle} in ${eventData.location}.`,
        generatedAt: new Date().toISOString()
      };
      
      await new Promise(resolve => setTimeout(resolve, 800));
      return { data: mockShortPrayer, success: true };
    }

    try {
      const response = await apiClient.post(AI_PRAYER_ENDPOINTS.GENERATE_PRAYER, {
        eventId: eventData.id,
        eventTitle: eventData.eventTitle,
        eventCategory: eventData.category,
        location: eventData.location,
        prayerType: 'global',
        maxLength,
        tone: 'compassionate'
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to generate global prayer');
      throw errorInfo;
    }
  },

  /**
   * Generate audio prayer via TTS
   */
  async generateAudioPrayer(eventData, options = {}) {
    const { voice = 'default', speed = 1.0, format = 'mp3' } = options;

    if (isMockMode()) {
      // Mock audio generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { 
        data: { 
          audioUrl: `/audio/generated_prayer_${eventData.id}.mp3`,
          duration: 45,
          generatedAt: new Date().toISOString()
        }, 
        success: true 
      };
    }

    try {
      const response = await apiClient.post('/api/ai/generate-audio-prayer', {
        eventId: eventData.id,
        prayerText: eventData.prayerText,
        voice,
        speed,
        format
      });
      return response;
    } catch (error) {
      const errorInfo = handleAPIError(error, 'Failed to generate audio prayer');
      throw errorInfo;
    }
  },
};
