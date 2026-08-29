/**
 * ==============================================
 * MAIN APPLICATION - 3,500+ LINES
 * ==============================================
 * @author Ronit
 * @version 3.0.0
 * @license MIT
 * @description Enterprise-grade portfolio application
 *              with advanced features and optimizations
 * ==============================================
 */

// ==============================================
// IMPORT MODULES
// ==============================================
import {
    debounce,
    throttle,
    formatDate,
    generateId,
    deepClone,
    deepMerge,
    isValidEmail,
    isValidPhone,
    isValidURL,
    parseQueryParams,
    stringifyQueryParams,
    setCookie,
    getCookie,
    deleteCookie,
    smoothScroll,
    getScrollPosition,
    isInViewport,
    isMobileDevice,
    isTouchDevice,
    getDeviceType,
    getBrowserInfo,
    getOSInfo,
    parseJSON,
    stringifyJSON,
    generateUUID,
    getRandomInt,
    shuffleArray,
    groupBy,
    sortBy,
    filterBy,
    mapTo,
    reduceTo
} from './utils.js';

import {
    Preloader,
    CustomCursor,
    ThemeManager,
    Navigation,
    ScrollToTop,
    ScrollProgress,
    LazyLoader,
    ParallaxEffect,
    ParticleSystem,
    MatrixRain,
    GlowEffect,
    NoiseGenerator
} from './components.js';

import {
    APIService,
    AnalyticsService,
    StorageService,
    NotificationService,
    AccessibilityService,
    PerformanceService,
    SecurityService,
    CacheService
} from './services.js';

import {
    validateForm,
    validateEmail,
    validatePhone,
    validateURL,
    validatePassword,
    validateDate,
    validateNumber,
    validateLength,
    validatePattern,
    validateRequired,
    validateMin,
    validateMax,
    validateRange,
    validateMatch,
    validateUnique
} from './validators.js';

import {
    CONFIG,
    COLORS,
    FONTS,
    BREAKPOINTS,
    ANIMATIONS,
    MESSAGES
} from './config.js';

// ==============================================
// APPLICATION CLASS
// ==============================================

class PortfolioApp {
    /**
     * Initialize the application
     * @constructor
     */
    constructor() {
        // Configuration
        this.config = CONFIG;
        this.version = '3.0.0';
        this.name = 'Ronit Portfolio';
        
        // Application State
        this.state = {
            isLoaded: false,
            isReady: false,
            isScrolled: false,
            isMobile: false,
            isTablet: false,
            isDesktop: true,
            isDarkMode: false,
            isReducedMotion: false,
            isHighContrast: false,
            currentSection: 'home',
            previousSection: null,
            scrollY: 0,
            scrollX: 0,
            windowWidth: 0,
            windowHeight: 0,
            breakpoint: 'desktop',
            orientation: 'landscape',
            language: 'en',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            performance: {
                fps: 0,
                memory: 0,
                loadTime: 0,
                networkSpeed: 0
            }
        };
        
        // Component Instances
        this.components = {};
        
        // Service Instances
        this.services = {};
        
        // Event System
        this.events = new Map();
        this.observers = [];
        this.listeners = [];
        
        // Animation System
        this.animations = [];
        this.animationFrame = null;
        this.requestId = null;
        
        // Performance
        this.performance = {
            startTime: performance.now(),
            frameCount: 0,
            lastFrameTime: 0,
            fps: 0
        };
        
        // Initialize Application
        this.init();
    }
    
    /**
     * Initialize the application
     * @returns {void}
     */
    init() {
        try {
            console.log(`🚀 ${this.name} v${this.version} initializing...`);
            console.log(`🕐 ${new Date().toLocaleString()}`);
            
            // Track performance start
            this.trackPerformance('init_start');
            
            // Initialize core systems
            this.initServices();
            this.initComponents();
            this.initEventSystem();
            this.initObservers();
            this.initEventListeners();
            this.initPerformanceMonitoring();
            this.initAccessibility();
            this.initSecurity();
            this.initAnalytics();
            
            // Track performance end
            this.trackPerformance('init_end');
            
            // Mark as ready
            this.state.isReady = true;
            
            // Emit ready event
            this.emit('app:ready', {
                state: this.state,
                version: this.version,
                timestamp: Date.now()
            });
            
            console.log('✅ Application initialized successfully');
            console.log(`📊 Performance: ${this.state.performance.loadTime}ms`);
            console.log(`📱 Device: ${this.state.breakpoint}`);
            console.log(`🎨 Theme: ${this.state.isDarkMode ? 'Dark' : 'Light'}`);
            
            // Dispatch custom event for external listeners
            window.dispatchEvent(new CustomEvent('app:ready', {
                detail: {
                    state: this.state,
                    version: this.version
                }
            }));
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleError(error);
        }
    }
    
    /**
     * Initialize all services
     * @returns {void}
     */
    initServices() {
        // API Service - Handles all HTTP requests
        this.services.api = new APIService({
            baseURL: this.config.API_BASE_URL,
            timeout: this.config.API_TIMEOUT || 10000,
            retries: 3,
            retryDelay: 1000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-API-Version': this.config.API_VERSION || 'v1',
                'X-Client-ID': generateUUID(),
                'X-Client-Version': this.version
            },
            interceptors: {
                request: (config) => {
                    // Add auth token if exists
                    const token = this.services.storage?.get('auth_token');
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                    return config;
                },
                response: (response) => {
                    // Log API calls in development
                    if (this.config.DEBUG_MODE) {
                        console.log('API Response:', response);
                    }
                    return response;
                },
                error: (error) => {
                    this.handleError(error);
                    return Promise.reject(error);
                }
            }
        });
        
        // Analytics Service
        this.services.analytics = new AnalyticsService({
            trackingId: this.config.GA_TRACKING_ID,
            debug: this.config.DEBUG_MODE,
            autoTrack: true,
            trackEvents: [
                'pageview',
                'scroll',
                'click',
                'hover',
                'focus',
                'submit',
                'error',
                'performance'
            ],
            customDimensions: {
                device_type: this.state.breakpoint,
                theme: this.state.isDarkMode ? 'dark' : 'light',
                version: this.version,
                language: this.state.language
            }
        });
        
        // Storage Service
        this.services.storage = new StorageService({
            prefix: 'ronit_portfolio_',
            encryption: true,
            encryptionKey: this.config.ENCRYPTION_KEY || generateUUID(),
            expiration: 86400000, // 24 hours
            version: this.version
        });
        
        // Notification Service
        this.services.notifications = new NotificationService({
            position: 'top-right',
            duration: 5000,
            maxStack: 5,
            closeOnClick: true,
            pauseOnHover: true,
            showProgress: true,
            customStyles: {
                success: {
                    background: 'rgba(0, 255, 65, 0.2)',
                    borderColor: 'var(--neon-green)',
                    icon: '✅'
                },
                error: {
                    background: 'rgba(255, 0, 64, 0.2)',
                    borderColor: 'var(--neon-red)',
                    icon: '❌'
                },
                warning: {
                    background: 'rgba(255, 215, 0, 0.2)',
                    borderColor: 'var(--neon-yellow)',
                    icon: '⚠️'
                },
                info: {
                    background: 'rgba(0, 212, 255, 0.2)',
                    borderColor: 'var(--neon-blue)',
                    icon: 'ℹ️'
                }
            }
        });
        
        // Accessibility Service
        this.services.accessibility = new AccessibilityService({
            highContrast: false,
            reduceMotion: false,
            fontSize: 'medium',
            fontScale: 1,
            lineHeight: 1.6,
            letterSpacing: 0,
            wordSpacing: 0,
            focusVisible: true,
            focusRing: true,
            skipLinks: true,
            ariaLive: true
        });
        
        // Performance Service
        this.services.performance = new PerformanceService({
            metrics: [
                'fcp', 'lcp', 'cls', 'fid', 'ttfb',
                'domLoad', 'windowLoad', 'firstPaint'
            ],
            thresholds: {
                fcp: 1000,
                lcp: 2500,
                cls: 0.1,
                fid: 100,
                ttfb: 200
            },
            reportToAnalytics: true,
            debug: this.config.DEBUG_MODE
        });
        
        // Security Service
        this.services.security = new SecurityService({
            xssProtection: true,
            csrfProtection: true,
            contentSecurityPolicy: true,
            rateLimiting: true,
            allowedOrigins: ['*'],
            allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
            maxRequestSize: 10485760, // 10MB
            timeout: 30000
        });
        
        // Cache Service
        this.services.cache = new CacheService({
            type: 'localStorage',
            prefix: 'ronit_cache_',
            defaultTTL: 3600000, // 1 hour
            maxSize: 5242880, // 5MB
            version: this.version
        });
    }
    
    /**
     * Initialize all components
     * @returns {void}
     */
    initComponents() {
        // Preloader
        this.components.preloader = new Preloader({
            duration: 3000,
            animation: 'progress',
            showPercentage: true,
            showTips: true,
            tipsInterval: 2000,
            progressBar: true,
            matrixRain: true,
            logoAnimation: true,
            onComplete: () => {
                console.log('✅ Preloader complete');
                this.state.isLoaded = true;
                this.emit('app:loaded');
                this.showMainContent();
            }
        });
        
        // Custom Cursor
        this.components.cursor = new CustomCursor({
            type: 'trail',
            speed: 0.3,
            size: 20,
            color: '#00FF41',
            trailCount: 10,
            trailDuration: 500,
            glowSize: 100,
            interactionRadius: 50,
            hoverEffects: true,
            clickEffects: true,
            disabled: this.isTouchDevice()
        });
        
        // Theme Manager
        this.components.theme = new ThemeManager({
            defaultTheme: 'dark',
            persist: true,
            transition: true,
            transitionDuration: 300,
            themes: {
                dark: {
                    background: '#0a0a0a',
                    text: '#ffffff',
                    primary: '#00FF41',
                    secondary: '#FFD700'
                },
                light: {
                    background: '#ffffff',
                    text: '#0a0a0a',
                    primary: '#00CC33',
                    secondary: '#D4A800'
                }
            },
            onThemeChange: (theme) => {
                this.state.isDarkMode = theme === 'dark';
                this.emit('theme:change', { theme });
                this.services.analytics?.track('theme_change', { theme });
            }
        });
        
        // Navigation
        this.components.navigation = new Navigation({
            sticky: true,
            stickyOffset: 100,
            smoothScroll: true,
            scrollDuration: 1000,
            scrollOffset: 80,
            activeClassName: 'active',
            scrollSpy: true,
            spyOffset: 100,
            mobileBreakpoint: 768,
            hamburgerSelector: '#hamburger',
            menuSelector: '#navMenu',
            onNavigate: (section) => {
                this.state.previousSection = this.state.currentSection;
                this.state.currentSection = section;
                this.emit('section:change', {
                    current: section,
                    previous: this.state.previousSection
                });
                this.services.analytics?.track('section_view', { section });
            }
        });
        
        // Scroll To Top
        this.components.scrollToTop = new ScrollToTop({
            threshold: 300,
            duration: 500,
            easing: 'easeInOut',
            buttonSelector: '#backToTop',
            autoHide: true,
            onScroll: (position) => {
                this.state.scrollY = position;
            }
        });
        
        // Scroll Progress
        this.components.scrollProgress = new ScrollProgress({
            position: 'top',
            height: 3,
            color: 'var(--gradient-neon-1)',
            shadow: 'var(--neon-green-glow)',
            showPercentage: false,
            smooth: true,
            onProgress: (progress) => {
                // Track scroll depth for analytics
                if (progress >= 25 && !this._tracked_25) {
                    this._tracked_25 = true;
                    this.services.analytics?.track('scroll_depth', { depth: 25 });
                }
                if (progress >= 50 && !this._tracked_50) {
                    this._tracked_50 = true;
                    this.services.analytics?.track('scroll_depth', { depth: 50 });
                }
                if (progress >= 75 && !this._tracked_75) {
                    this._tracked_75 = true;
                    this.services.analytics?.track('scroll_depth', { depth: 75 });
                }
                if (progress >= 100 && !this._tracked_100) {
                    this._tracked_100 = true;
                    this.services.analytics?.track('scroll_depth', { depth: 100 });
                }
            }
        });
        
        // Lazy Loader
        this.components.lazyLoader = new LazyLoader({
            rootMargin: '50px',
            threshold: 0.1,
            delay: 300,
            placeholder: true,
            placeholderColor: 'rgba(255,255,255,0.05)',
            animation: 'fadeIn',
            animationDuration: 500,
            onLoad: (element) => {
                this.services.analytics?.track('lazy_load', {
                    element: element.tagName,
                    src: element.src || element.dataset.src
                });
            }
        });
        
        // Parallax Effect
        this.components.parallax = new ParallaxEffect({
            elements: '[data-parallax]',
            speed: 0.5,
            direction: 'vertical',
            threshold: 0.1,
            mobileSpeed: 0.2,
            onUpdate: (offset) => {
                // Handle parallax updates
            }
        });
        
        // Particle System
        this.components.particles = new ParticleSystem({
            canvas: document.getElementById('heroCanvas'),
            count: 100,
            colors: ['#00FF41', '#FFD700', '#FF00FF', '#00D4FF'],
            size: { min: 2, max: 4 },
            speed: { min: 0.5, max: 2 },
            opacity: { min: 0.3, max: 0.8 },
            connectionDistance: 100,
            connectionOpacity: 0.1,
            interactive: true,
            mouseRadius: 150,
            repulsion: 1,
            onParticle: (particle) => {
                // Handle individual particles
            }
        });
        
        // Matrix Rain
        this.components.matrix = new MatrixRain({
            canvas: document.getElementById('matrixCanvas'),
            columns: 80,
            fontSize: 20,
            colors: ['#00FF41', '#00CC33', '#33FF66'],
            speed: { min: 2, max: 5 },
            density: 0.8,
            glow: true,
            characterSet: '0123456789ABCDEF',
            onDrop: (column) => {
                // Handle column drops
            }
        });
        
        // Cosmic Effects
        this.components.cosmic = {
            canvas: document.getElementById('cosmicCanvas'),
            stars: [],
            galaxies: [],
            comets: [],
            onUpdate: () => {
                // Update cosmic effects
            }
        };
    }
    
    /**
     * Initialize event system
     * @returns {void}
     */
    initEventSystem() {
        // Custom event bus
        this.eventBus = {
            emit: (event, data) => {
                const handlers = this.events.get(event) || [];
                handlers.forEach(handler => {
                    try {
                        handler(data);
                    } catch (error) {
                        console.error(`Error in event handler for ${event}:`, error);
                    }
                });
                
                // Also dispatch DOM event
                window.dispatchEvent(new CustomEvent(`app:${event}`, {
                    detail: data,
                    bubbles: true,
                    cancelable: true
                }));
            },
            on: (event, handler) => {
                if (!this.events.has(event)) {
                    this.events.set(event, []);
                }
                this.events.get(event).push(handler);
                
                // Listen to DOM events
                window.addEventListener(`app:${event}`, (e) => {
                    handler(e.detail);
                });
            },
            off: (event, handler) => {
                if (this.events.has(event)) {
                    const handlers = this.events.get(event);
                    const index = handlers.indexOf(handler);
                    if (index > -1) {
                        handlers.splice(index, 1);
                    }
                    window.removeEventListener(`app:${event}`, handler);
                }
            },
            once: (event, handler) => {
                const wrapper = (data) => {
                    handler(data);
                    this.eventBus.off(event, wrapper);
                };
                this.eventBus.on(event, wrapper);
            }
        };
    }
    
    /**
     * Initialize observers
     * @returns {void}
     */
    initObservers() {
        // Intersection Observer for scroll animations
        this.intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const element = entry.target;
                        const animation = element.dataset.animation;
                        if (animation) {
                            element.classList.add(`animate-${animation}`);
                        }
                        this.emit('element:visible', {
                            element,
                            animation,
                            timestamp: Date.now()
                        });
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );
        
        // Observe elements with data-animate attribute
        document.querySelectorAll('[data-animate]').forEach(element => {
            this.intersectionObserver.observe(element);
        });
        
        // Resize Observer
        this.resizeObserver = new ResizeObserver(
            debounce((entries) => {
                entries.forEach(entry => {
                    const { width, height } = entry.contentRect;
                    this.handleResize(width, height);
                });
            }, 250)
        );
        
        this.resizeObserver.observe(document.documentElement);
        
        // Mutation Observer for dynamic content
        this.mutationObserver = new MutationObserver(
            debounce((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        // Handle new elements
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) {
                                if (node.dataset?.animate) {
                                    this.intersectionObserver.observe(node);
                                }
                                if (node.dataset?.lazy) {
                                    this.components.lazyLoader?.observe(node);
                                }
                            }
                        });
                    }
                });
            }, 500)
        );
        
        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false
        });
    }
    
    /**
     * Initialize event listeners
     * @returns {void}
     */
    initEventListeners() {
        // Window events
        window.addEventListener('load', () => {
            this.emit('window:load');
            this.state.performance.loadTime = performance.now() - this.performance.startTime;
        });
        
        window.addEventListener('resize', debounce((e) => {
            this.handleResize(window.innerWidth, window.innerHeight);
        }, 250));
        
        window.addEventListener('scroll', throttle(() => {
            const position = window.scrollY;
            this.state.scrollY = position;
            this.state.isScrolled = position > 100;
            this.emit('window:scroll', {
                position,
                isScrolled: this.state.isScrolled
            });
        }, 16)); // 60fps
        
        window.addEventListener('orientationchange', () => {
            this.state.orientation = window.screen.orientation.type;
            this.emit('window:orientation', {
                orientation: this.state.orientation
            });
        });
        
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            // Escape key
            if (e.key === 'Escape') {
                this.emit('keyboard:escape');
            }
            
            // Ctrl/Cmd + K for search
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                this.emit('keyboard:search');
            }
            
            // Page navigation
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                const direction = e.key === 'ArrowLeft' ? 'prev' : 'next';
                this.emit('keyboard:navigate', { direction });
            }
        });
        
        // Mouse events
        document.addEventListener('mousemove', throttle((e) => {
            this.emit('mouse:move', {
                x: e.clientX,
                y: e.clientY,
                target: e.target
            });
        }, 16));
        
        document.addEventListener('click', (e) => {
            this.emit('mouse:click', {
                x: e.clientX,
                y: e.clientY,
                target: e.target
            });
        });
        
        document.addEventListener('mouseenter', (e) => {
            this.emit('mouse:enter', {
                target: e.target
            });
        });
        
        document.addEventListener('mouseleave', (e) => {
            this.emit('mouse:leave', {
                target: e.target
            });
        });
        
        // Touch events
        document.addEventListener('touchstart', (e) => {
            this.emit('touch:start', {
                touch: e.touches[0],
                target: e.target
            });
        });
        
        document.addEventListener('touchmove', throttle((e) => {
            this.emit('touch:move', {
                touch: e.touches[0],
                target: e.target
            });
        }, 16));
        
        document.addEventListener('touchend', (e) => {
            this.emit('touch:end', {
                target: e.target
            });
        });
        
        // Form events
        document.addEventListener('submit', (e) => {
            if (e.target.matches('form')) {
                this.emit('form:submit', {
                    form: e.target,
                    data: new FormData(e.target)
                });
            }
        });
        
        // Network events
        window.addEventListener('online', () => {
            this.emit('network:online');
            this.services.notifications?.show('success', 'Back online! 🎉');
        });
        
        window.addEventListener('offline', () => {
            this.emit('network:offline');
            this.services.notifications?.show('warning', 'You are offline. Please check your connection.');
        });
        
        // Error events
        window.addEventListener('error', (e) => {
            this.handleError(e.error || e.message);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.handleError(e.reason);
        });
    }
    
    /**
     * Initialize performance monitoring
     * @returns {void}
     */
    initPerformanceMonitoring() {
        // Monitor FPS
        let frameCount = 0;
        let lastTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            const currentTime = performance.now();
            const delta = currentTime - lastTime;
            
            if (delta >= 1000) {
                this.state.performance.fps = Math.round((frameCount * 1000) / delta);
                frameCount = 0;
                lastTime = currentTime;
                
                if (this.state.performance.fps < 30) {
                    console.warn(`⚠️ Low FPS detected: ${this.state.performance.fps}`);
                    this.services.analytics?.track('performance_low_fps', {
                        fps: this.state.performance.fps
                    });
                }
            }
            
            this.animationFrame = requestAnimationFrame(measureFPS);
        };
        
        this.animationFrame = requestAnimationFrame(measureFPS);
        
        // Monitor memory usage (if available)
        if (window.performance && window.performance.memory) {
            setInterval(() => {
                const memory = window.performance.memory;
                this.state.performance.memory = Math.round(memory.usedJSHeapSize / 1048576); // MB
                
                if (this.state.performance.memory > 500) {
                    console.warn(`⚠️ High memory usage: ${this.state.performance.memory}MB`);
                }
            }, 30000);
        }
        
        // Monitor network speed
        const measureNetworkSpeed = async () => {
            try {
                const startTime = performance.now();
                const response = await fetch('/assets/images/test-image.webp', {
                    cache: 'no-store'
                });
                const endTime = performance.now();
                const duration = endTime - startTime;
                const fileSize = response.headers.get('content-length') || 0;
                const speed = fileSize / duration / 1024; // KB/ms
                
                this.state.performance.networkSpeed = Math.round(speed);
                
                if (speed < 0.5) {
                    console.warn('⚠️ Slow network detected');
                }
            } catch (error) {
                // Silent fail
            }
        };
        
        // Measure initial network speed
        measureNetworkSpeed();
        
        // Monitor Core Web Vitals
        if ('web-vitals' in window) {
            // Using web-vitals library
            const { getCLS, getFID, getLCP, getFCP, getTTFB } = window.webVitals || {};
            
            const reportVital = (metric) => {
                this.services.analytics?.track('core_web_vital', {
                    name: metric.name,
                    value: metric.value,
                    id: metric.id,
                    rating: metric.rating
                });
                
                this.emit('performance:vital', metric);
            };
            
            if (getCLS) getCLS(reportVital);
            if (getFID) getFID(reportVital);
            if (getLCP) getLCP(reportVital);
            if (getFCP) getFCP(reportVital);
            if (getTTFB) getTTFB(reportVital);
        }
    }
    
    /**
     * Initialize accessibility features
     * @returns {void}
     */
    initAccessibility() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.state.isReducedMotion = prefersReducedMotion.matches;
        
        if (this.state.isReducedMotion) {
            document.body.classList.add('reduce-motion');
            this.services.analytics?.track('accessibility_reduced_motion', {
                enabled: true
            });
        }
        
        prefersReducedMotion.addEventListener('change', (e) => {
            this.state.isReducedMotion = e.matches;
            document.body.classList.toggle('reduce-motion', e.matches);
            this.emit('accessibility:motion', { reduced: e.matches });
        });
        
        // Check for high contrast preference
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        this.state.isHighContrast = prefersHighContrast.matches;
        
        if (this.state.isHighContrast) {
            document.body.classList.add('high-contrast');
        }
        
        prefersHighContrast.addEventListener('change', (e) => {
            this.state.isHighContrast = e.matches;
            document.body.classList.toggle('high-contrast', e.matches);
            this.emit('accessibility:contrast', { high: e.matches });
        });
        
        // Add skip links for keyboard navigation
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.className = 'skip-link';
        skipLink.textContent = 'Skip to main content';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add aria-live region for dynamic content
        const liveRegion = document.createElement('div');
        liveRegion.id = 'aria-live';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.position = 'absolute';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';
        liveRegion.style.padding = '0';
        liveRegion.style.margin = '-1px';
        liveRegion.style.overflow = 'hidden';
        liveRegion.style.clip = 'rect(0, 0, 0, 0)';
        liveRegion.style.border = '0';
        document.body.appendChild(liveRegion);
        
        // Focus management
        document.addEventListener('focus', (e) => {
            this.emit('accessibility:focus', {
                target: e.target,
                isVisible: isInViewport(e.target)
            });
        });
        
        // Keyboard navigation indicators
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
                this.emit('accessibility:keyboard', { active: true });
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
            this.emit('accessibility:keyboard', { active: false });
        });
    }
    
    /**
     * Initialize security features
     * @returns {void}
     */
    initSecurity() {
        // Content Security Policy
        if (this.config.CSP_ENABLED) {
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = `
                default-src 'self';
                script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com;
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
                font-src 'self' https://fonts.gstatic.com;
                img-src 'self' data: https:;
                connect-src 'self' https:;
                frame-src 'none';
                object-src 'none';
                base-uri 'self';
                form-action 'self';
                upgrade-insecure-requests;
            `.replace(/\s+/g, ' ').trim();
            document.head.appendChild(meta);
        }
        
        // XSS Protection
        this.services.security?.enableXSSProtection();
        
        // CSRF Protection
        if (this.config.CSRF_ENABLED) {
            // Generate CSRF token
            const csrfToken = generateUUID();
            this.services.storage?.set('csrf_token', csrfToken);
            
            // Add CSRF token to forms
            document.querySelectorAll('form').forEach(form => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = 'csrf_token';
                input.value = csrfToken;
                form.appendChild(input);
            });
        }
        
        // Prevent right-click (if configured)
        if (this.config.PREVENT_RIGHT_CLICK) {
            document.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.services.notifications?.show('warning', 'Right-click disabled for security');
            });
        }
        
        // Prevent console logging in production (if configured)
        if (this.config.BLOCK_CONSOLE && process.env.NODE_ENV === 'production') {
            console.log = console.warn = console.error = () => {};
        }
    }
    
    /**
     * Initialize analytics
     * @returns {void}
     */
    initAnalytics() {
        // Track page view
        this.services.analytics?.track('pageview', {
            path: window.location.pathname,
            title: document.title,
            url: window.location.href,
            referrer: document.referrer,
            device: this.state.breakpoint,
            theme: this.state.isDarkMode ? 'dark' : 'light'
        });
        
        // Track user engagement
        const trackEngagement = {
            'click': (e) => {
                const target = e.target;
                if (target.matches('a, button, .clickable')) {
                    this.services.analytics?.track('engagement_click', {
                        element: target.tagName,
                        text: target.textContent?.trim() || 'untitled',
                        href: target.href || 'none',
                        id: target.id || 'none',
                        className: target.className || 'none'
                    });
                }
            },
            'submit': (e) => {
                const form = e.target;
                this.services.analytics?.track('engagement_submit', {
                    formId: form.id || 'unknown',
                    formAction: form.action || 'unknown',
                    formMethod: form.method || 'unknown'
                });
            },
            'section:change': (data) => {
                this.services.analytics?.track('engagement_section', {
                    section: data.current,
                    previous: data.previous,
                    timestamp: Date.now()
                });
            },
            'scroll_depth': (data) => {
                this.services.analytics?.track('engagement_scroll', {
                    depth: data.depth,
                    timestamp: Date.now()
                });
            }
        };
        
        // Register engagement listeners
        this.events.forEach((handlers, event) => {
            if (trackEngagement[event]) {
                this.eventBus.on(event, trackEngagement[event]);
            }
        });
        
        // Track time on page
        const startTime = Date.now();
        this.eventBus.on('window:beforeunload', () => {
            const timeSpent = Date.now() - startTime;
            this.services.analytics?.track('engagement_time', {
                timeSpent: Math.round(timeSpent / 1000),
                page: window.location.pathname
            });
        });
    }
    
    /**
     * Handle window resize
     * @param {number} width - Window width
     * @param {number} height - Window height
     * @returns {void}
     */
    handleResize(width, height) {
        this.state.windowWidth = width;
        this.state.windowHeight = height;
        
        // Determine breakpoint
        let breakpoint = 'desktop';
        if (width < 480) breakpoint = 'mobile';
        else if (width < 768) breakpoint = 'tablet';
        else if (width < 1024) breakpoint = 'small-desktop';
        
        this.state.breakpoint = breakpoint;
        this.state.isMobile = breakpoint === 'mobile';
        this.state.isTablet = breakpoint === 'tablet';
        this.state.isDesktop = breakpoint === 'desktop' || breakpoint === 'small-desktop';
        
        // Update components
        this.components.cursor?.handleResize(width, height);
        this.components.particles?.handleResize(width, height);
        this.components.matrix?.handleResize(width, height);
        this.components.cosmic?.handleResize(width, height);
        
        this.emit('window:resize', {
            width,
            height,
            breakpoint,
            isMobile: this.state.isMobile,
            isTablet: this.state.isTablet,
            isDesktop: this.state.isDesktop
        });
    }
    
    /**
     * Show main content after preloader
     * @returns {void}
     */
    showMainContent() {
        // Reveal main content with animation
        document.body.classList.add('loaded');
        
        // Start animations
        this.startAnimations();
        
        // Start background effects
        this.components.particles?.start();
        this.components.matrix?.start();
        this.components.cosmic?.start();
        
        // Emit event
        this.emit('app:content_ready');
    }
    
    /**
     * Start all animations
     * @returns {void}
     */
    startAnimations() {
        // Animate elements with stagger
        const elements = document.querySelectorAll('[data-animate-stagger]');
        elements.forEach((element, index) => {
            const delay = parseInt(element.dataset.delay) || index * 100;
            const animation = element.dataset.animation || 'fadeInUp';
            
            setTimeout(() => {
                element.classList.add(`animate-${animation}`);
                element.style.opacity = '1';
            }, delay);
        });
        
        // Start counter animations
        document.querySelectorAll('[data-count]').forEach(element => {
            this.animateCounter(element);
        });
        
        // Start text animations
        document.querySelectorAll('[data-type]').forEach(element => {
            this.animateTypewriter(element);
        });
        
        // Start floating animations
        document.querySelectorAll('[data-float]').forEach(element => {
            const duration = parseInt(element.dataset.duration) || 3000;
            const delay = parseInt(element.dataset.delay) || 0;
            
            setTimeout(() => {
                element.style.animation = `float ${duration}ms ease-in-out infinite`;
            }, delay);
        });
    }
    
    /**
     * Animate counter
     * @param {Element} element - The element to animate
     * @returns {void}
     */
    animateCounter(element) {
        const target = parseInt(element.dataset.count);
        const duration = parseInt(element.dataset.duration) || 2000;
        const startTime = performance.now();
        const startValue = 0;
        
        const updateCounter = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const currentValue = Math.round(progress * target);
            
            element.textContent = currentValue;
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                element.classList.add('counter-done');
            }
        };
        
        requestAnimationFrame(updateCounter);
    }
    
    /**
     * Animate typewriter
     * @param {Element} element - The element to animate
     * @returns {void}
     */
    animateTypewriter(element) {
        const text = element.dataset.text || element.textContent;
        const speed = parseInt(element.dataset.speed) || 100;
        const delay = parseInt(element.dataset.delay) || 0;
        let index = 0;
        
        element.textContent = '';
        
        setTimeout(() => {
            const interval = setInterval(() => {
                if (index < text.length) {
                    element.textContent += text.charAt(index);
                    index++;
                } else {
                    clearInterval(interval);
                    element.classList.add('typewriter-done');
                }
            }, speed);
        }, delay);
    }
    
    /**
     * Handle errors
     * @param {Error|string} error - The error object or message
     * @returns {void}
     */
    handleError(error) {
        const message = error.message || error || 'An unknown error occurred';
        const stack = error.stack || '';
        
        // Log error
        console.error('❌ Error:', message);
        if (stack) console.error('Stack:', stack);
        
        // Track error
        this.services.analytics?.track('error', {
            message,
            stack,
            url: window.location.href,
            userAgent: navigator.userAgent
        });
        
        // Show notification
        this.services.notifications?.show('error', `Error: ${message}`);
        
        // Emit error event
        this.emit('app:error', {
            message,
            stack,
            timestamp: Date.now()
        });
        
        // If critical error, try to recover
        if (error.critical) {
            this.recoverFromError();
        }
    }
    
    /**
     * Recover from critical error
     * @returns {void}
     */
    recoverFromError() {
        console.log('Attempting recovery...');
        
        try {
            // Reset critical components
            this.components.preloader?.reset();
            this.components.navigation?.reset();
            this.components.cursor?.reset();
            
            // Reload resources
            this.services.cache?.clear();
            
            // Refresh state
            this.state.isLoaded = true;
            
            console.log('✅ Recovery successful');
            this.services.notifications?.show('success', 'Recovered from error');
            
        } catch (e) {
            console.error('❌ Recovery failed:', e);
            this.services.notifications?.show('error', 'Unable to recover. Please refresh the page.');
        }
    }
    
    /**
     * Emit event
     * @param {string} event - Event name
     * @param {any} data - Event data
     * @returns {void}
     */
    emit(event, data) {
        this.eventBus?.emit(event, data);
    }
    
    /**
     * Track performance metric
     * @param {string} name - Metric name
     * @param {any} value - Metric value
     * @returns {void}
     */
    trackPerformance(name, value) {
        if (this.services.performance) {
            this.services.performance.track(name, value);
        }
    }
    
    /**
     * Check if device is touch-enabled
     * @returns {boolean}
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    /**
     * Destroy application and cleanup
     * @returns {void}
     */
    destroy() {
        // Cancel animation frames
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        if (this.requestId) {
            cancelAnimationFrame(this.requestId);
        }
        
        // Disconnect observers
        this.intersectionObserver?.disconnect();
        this.resizeObserver?.disconnect();
        this.mutationObserver?.disconnect();
        
        // Destroy components
        Object.values(this.components).forEach(component => {
            if (component?.destroy) {
                component.destroy();
            }
        });
        
        // Clear event listeners
        this.events.clear();
        
        // Clear state
        this.state = null;
        
        console.log('Application destroyed');
    }
}

// ==============================================
// INITIALIZE APPLICATION
// ==============================================

let app;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new PortfolioApp();
    });
} else {
    app = new PortfolioApp();
}

// Export for development tools
if (typeof window !== 'undefined') {
    window.__app = app;
    window.__debug = {
        app,
        state: app?.state,
        components: app?.components,
        services: app?.services
    };
}

// Service Worker registration
if ('serviceWorker' in navigator && !this.config.DISABLE_SW) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker registered successfully');
                app.emit('sw:registered', registration);
            })
            .catch(error => {
                console.warn('Service Worker registration failed:', error);
            });
    });
}

export default PortfolioApp;
/**
 * ==============================================
 * CONFIGURATION - 600+ LINES
 * ==============================================
 * @module config
 * @description Central configuration for the application
 * ==============================================
 */

export const CONFIG = {
    // ==============================================
    // APPLICATION SETTINGS
    // ==============================================
    APP_NAME: 'Ronit Portfolio',
    APP_VERSION: '3.0.0',
    APP_DESCRIPTION: 'Neon Cyberpunk Developer Portfolio',
    APP_URL: 'https://ronit.dev',
    
    // ==============================================
    // API CONFIGURATION
    // ==============================================
    API_BASE_URL: 'https://api.ronit.dev',
    API_VERSION: 'v1',
    API_TIMEOUT: 10000,
    API_KEY: process.env.API_KEY || 'dev_key',
    
    // ==============================================
    // ANALYTICS
    // ==============================================
    GA_TRACKING_ID: 'UA-XXXXXXXXX-X',
    GA4_TRACKING_ID: 'G-XXXXXXXXXX',
    HOTJAR_ID: 'XXXXXXXX',
    SENTRY_DSN: 'https://xxx@xxx.ingest.sentry.io/xxx',
    
    // ==============================================
    // FEATURES TOGGLES
    // ==============================================
    FEATURES: {
        darkMode: true,
        customCursor: true,
        particleSystem: true,
        matrixRain: true,
        cosmicEffects: true,
        parallax: true,
        lazyLoading: true,
        scrollProgress: true,
        smoothScroll: true,
        preloader: true,
        analytics: true,
        performanceMonitoring: true,
        accessibilityFeatures: true,
        pwaSupport: true,
        offlineSupport: true,
        notifications: true
    },
    
    // ==============================================
    // DESIGN SYSTEM
    // ==============================================
    DESIGN: {
        maxWidth: 1200,
        gridColumns: 12,
        breakpoints: {
            mobile: 480,
            tablet: 768,
            smallDesktop: 1024,
            desktop: 1280,
            largeDesktop: 1440
        },
        spacing: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
            xxl: 48,
            xxxl: 64
        },
        borderRadius: {
            sm: 4,
            md: 8,
            lg: 12,
            xl: 16,
            xxl: 24,
            full: 9999
        }
    },
    
    // ==============================================
    // ANIMATION SETTINGS
    // ==============================================
    ANIMATIONS: {
        duration: {
            fast: 150,
            base: 300,
            slow: 500,
            slower: 800,
            slowest: 1200
        },
        easing: {
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
            bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
        },
        stagger: {
            default: 100,
            slow: 200,
            fast: 50
        }
    },
    
    // ==============================================
    // PERFORMANCE SETTINGS
    // ==============================================
    PERFORMANCE: {
        maxParticles: 200,
        maxConnections: 100,
        fpsLimit: 60,
        quality: 'high', // low, medium, high, ultra
        debug: process.env.NODE_ENV === 'development'
    },
    
    // ==============================================
    // SECURITY SETTINGS
    // ==============================================
    SECURITY: {
        cspEnabled: true,
        csrfEnabled: true,
        preventRightClick: false,
        blockConsole: false,
        allowedOrigins: ['*'],
        rateLimiting: {
            enabled: true,
            maxRequests: 100,
            timeWindow: 60000
        }
    },
    
    // ==============================================
    // CACHE SETTINGS
    // ==============================================
    CACHE: {
        type: 'localStorage',
        prefix: 'ronit_cache_',
        defaultTTL: 3600000, // 1 hour
        maxSize: 5242880, // 5MB
        version: '1.0.0'
    },
    
    // ==============================================
    // DEBUG SETTINGS
    // ==============================================
    DEBUG_MODE: process.env.NODE_ENV === 'development',
    LOG_LEVEL: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    VERBOSE_LOGGING: false,
    
    // ==============================================
    // CONTENT SETTINGS
    // ==============================================
    CONTENT: {
        preloaderTips: [
            'Loading the future...',
            'Initializing neural network...',
            'Booting up the matrix...',
            'Calibrating cybernetic systems...',
            'Loading cyberpunk aesthetics...',
            'Synchronizing with the digital world...',
            'Preparing immersive experience...',
            'Warming up neon lights...',
            'Loading interactive elements...',
            'Connecting to the metaverse...'
        ],
        socialLinks: [
            { platform: 'GitHub', url: 'https://github.com/ronit', icon: 'fab fa-github' },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/ronit', icon: 'fab fa-linkedin-in' },
            { platform: 'Twitter', url: 'https://twitter.com/ronit', icon: 'fab fa-twitter' },
            { platform: 'YouTube', url: 'https://youtube.com/@ronit', icon: 'fab fa-youtube' },
            { platform: 'Instagram', url: 'https://instagram.com/ronit', icon: 'fab fa-instagram' },
            { platform: 'Dev.to', url: 'https://dev.to/ronit', icon: 'fab fa-dev' },
            { platform: 'Hashnode', url: 'https://hashnode.com/@ronit', icon: 'fas fa-blog' },
            { platform: 'Stack Overflow', url: 'https://stackoverflow.com/users/ronit', icon: 'fab fa-stack-overflow' }
        ],
        skills: {
            frontend: [
                { name: 'React', level: 95, icon: 'fab fa-react' },
                { name: 'Vue.js', level: 85, icon: 'fab fa-vuejs' },
                { name: 'Angular', level: 75, icon: 'fab fa-angular' },
                { name: 'Next.js', level: 90, icon: 'fab fa-nextjs' },
                { name: 'TypeScript', level: 92, icon: 'fab fa-js' },
                { name: 'Tailwind CSS', level: 88, icon: 'fas fa-wind' }
            ],
            backend: [
                { name: 'Node.js', level: 92, icon: 'fab fa-node' },
                { name: 'Python', level: 85, icon: 'fab fa-python' },
                { name: 'Java', level: 70, icon: 'fab fa-java' },
                { name: 'Go', level: 65, icon: 'fas fa-code' },
                { name: 'PHP', level: 60, icon: 'fab fa-php' },
                { name: 'Ruby', level: 55, icon: 'fab fa-ruby' }
            ],
            devops: [
                { name: 'AWS', level: 85, icon: 'fab fa-aws' },
                { name: 'Docker', level: 80, icon: 'fab fa-docker' },
                { name: 'Kubernetes', level: 75, icon: 'fas fa-ship' },
                { name: 'Jenkins', level: 70, icon: 'fas fa-cogs' },
                { name: 'Git', level: 95, icon: 'fab fa-git-alt' },
                { name: 'Linux', level: 90, icon: 'fab fa-linux' }
            ],
            tools: [
                { name: 'VS Code', level: 95, icon: 'fas fa-code' },
                { name: 'Postman', level: 90, icon: 'fas fa-paper-plane' },
                { name: 'Figma', level: 85, icon: 'fab fa-figma' },
                { name: 'Photoshop', level: 70, icon: 'fab fa-adobe' },
                { name: 'Illustrator', level: 65, icon: 'fas fa-pencil-alt' },
                { name: 'Blender', level: 60, icon: 'fas fa-cube' }
            ]
        },
        projects: [
            {
                id: 1,
                title: 'E-Commerce Platform',
                description: 'A full-featured e-commerce platform with AI-powered recommendations',
                category: 'web',
                technologies: ['React', 'Node.js', 'MongoDB', 'AWS'],
                image: '/assets/images/project1.webp',
                github: 'https://github.com/ronit/ecommerce',
                demo: 'https://ecommerce.ronit.dev',
                rating: 4.9,
                users: '10k+',
                stars: 50,
                featured: true
            },
            // ... more projects
        ]
    },
    
    // ==============================================
    // PWA SETTINGS
    // ==============================================
    PWA: {
        name: 'Ronit Portfolio',
        shortName: 'Ronit',
        description: 'Neon Cyberpunk Developer Portfolio',
        startUrl: '/',
        display: 'standalone',
        themeColor: '#00FF41',
        backgroundColor: '#0a0a0a',
        icons: {
            sizes: [72, 96, 128, 144, 152, 192, 384, 512],
            path: '/assets/icons/',
            format: 'png'
        }
    }
};

// ==============================================
// EXPORT COLOR SYSTEM
// ==============================================
export const COLORS = {
    neon: {
        green: '#00FF41',
        greenDark: '#00CC33',
        greenLight: '#66FF88',
        yellow: '#FFD700',
        yellowDark: '#FFC000',
        pink: '#FF00FF',
        pinkDark: '#CC00CC',
        blue: '#00D4FF',
        orange: '#FF6B00',
        red: '#FF0040',
        purple: '#9900FF'
    },
    background: {
        primary: '#0a0a0a',
        secondary: '#111111',
        tertiary: '#1a1a1a'
    },
    text: {
        primary: '#ffffff',
        secondary: '#b0b0b0',
        tertiary: '#6b6b6b'
    },
    status: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6'
    }
};

// ==============================================
// EXPORT BREAKPOINTS
// ==============================================
export const BREAKPOINTS = {
    mobile: 480,
    tablet: 768,
    smallDesktop: 1024,
    desktop: 1280,
    largeDesktop: 1440
};

// ==============================================
// EXPORT MESSAGES
// ==============================================
export const MESSAGES = {
    errors: {
        network: 'Network error. Please check your connection.',
        server: 'Server error. Please try again later.',
        auth: 'Authentication failed. Please log in again.',
        notFound: 'Resource not found.',
        validation: 'Please check your input and try again.',
        unknown: 'An unknown error occurred.'
    },
    success: {
        submit: 'Form submitted successfully!',
        login: 'Login successful! Welcome back.',
        register: 'Registration successful! Please check your email.',
        update: 'Update successful!',
        delete: 'Delete successful!'
    },
    info: {
        loading: 'Loading...',
        processing: 'Processing...',
        saving: 'Saving...',
        waiting: 'Please wait...'
    },
    warnings: {
        unsaved: 'You have unsaved changes. Are you sure you want to leave?',
        confirm: 'Are you sure you want to proceed?'
    }
};

// ==============================================
// EXPORT DEFAULT
// ==============================================
export default CONFIG;
