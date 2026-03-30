"""
Job Platform Hub - Flask Backend
Enterprise-ready backend with database integration support
Author: Prashu Mishra
Version: 1.0.0
"""

import os
import jwt
import bcrypt
import logging
from datetime import datetime, timedelta
from functools import wraps
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from redis import Redis
from celery import Celery
from flasgger import Swagger, swag_from
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============================================
# APPLICATION CONFIGURATION
# ============================================

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configuration Class
class Config:
    # Flask Config
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-here-change-in-production')
    
    # Database Config (Support multiple databases)
    # PostgreSQL, MySQL, SQLite support
    DB_TYPE = os.getenv('DB_TYPE', 'sqlite')  # sqlite, postgresql, mysql
    
    if DB_TYPE == 'postgresql':
        SQLALCHEMY_DATABASE_URI = f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    elif DB_TYPE == 'mysql':
        SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    else:
        SQLALCHEMY_DATABASE_URI = 'sqlite:///jobplatform.db'
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_size': 10,
        'pool_recycle': 3600,
        'pool_pre_ping': True
    }
    
    # Redis Config (for caching and session)
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    SESSION_TYPE = 'redis'
    SESSION_REDIS = Redis.from_url(REDIS_URL)
    
    # JWT Config
    JWT_SECRET = os.getenv('JWT_SECRET', SECRET_KEY)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Celery Config (for async tasks)
    CELERY_BROKER_URL = os.getenv('CELERY_BROKER_URL', 'redis://localhost:6379/1')
    CELERY_RESULT_BACKEND = os.getenv('CELERY_RESULT_BACKEND', 'redis://localhost:6379/2')
    
    # Email Config
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    
    # File Upload Config
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB
    ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx', 'jpg', 'png'}

app.config.from_object(Config)

# Initialize extensions
db = SQLAlchemy(app)
migrate = Migrate(app, db)
celery = Celery(app.name, broker=app.config['CELERY_BROKER_URL'])
celery.conf.update(app.config)

# Initialize Swagger for API documentation
swagger = Swagger(app, template={
    'swagger': '2.0',
    'info': {
        'title': 'Job Platform Hub API',
        'description': 'Enterprise Job Board Platform API',
        'version': '1.0.0',
        'contact': {
            'name': 'Prashu Mishra',
            'email': 'prashumishra714@gmail.com'
        }
    },
    'basePath': '/api/v1'
})

# ============================================
# DATABASE MODELS
# ============================================

class User(db.Model):
    """User Model - Supports multiple roles"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(50), nullable=False)  # employee, employer, recruiter, admin
    company_name = db.Column(db.String(255))
    phone = db.Column(db.String(20))
    location = db.Column(db.String(255))
    bio = db.Column(db.Text)
    skills = db.Column(db.JSON, default=list)
    resume_url = db.Column(db.String(500))
    profile_picture = db.Column(db.String(500))
    email_verified = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    last_login = db.Column(db.DateTime)
    preferences = db.Column(db.JSON, default=dict)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    jobs = db.relationship('Job', backref='employer', lazy=True, foreign_keys='Job.employer_id')
    applications = db.relationship('Application', backref='applicant', lazy=True)
    saved_jobs = db.relationship('SavedJob', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'company_name': self.company_name,
            'phone': self.phone,
            'location': self.location,
            'bio': self.bio,
            'skills': self.skills,
            'profile_picture': self.profile_picture,
            'email_verified': self.email_verified,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
    
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))

class Job(db.Model):
    """Job Model - Job listings"""
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    employer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.JSON, default=list)
    nice_to_have = db.Column(db.JSON, default=list)
    responsibilities = db.Column(db.JSON, default=list)
    location = db.Column(db.String(255))
    remote_type = db.Column(db.String(50))  # remote, hybrid, onsite
    salary_min = db.Column(db.Integer)
    salary_max = db.Column(db.Integer)
    currency = db.Column(db.String(3), default='USD')
    job_type = db.Column(db.String(50))  # full-time, part-time, contract, internship
    experience_level = db.Column(db.String(50))  # entry, mid, senior, lead
    skills_required = db.Column(db.JSON, default=list)
    benefits = db.Column(db.JSON, default=list)
    status = db.Column(db.String(50), default='active')  # active, paused, filled, expired
    views_count = db.Column(db.Integer, default=0)
    applications_count = db.Column(db.Integer, default=0)
    posted_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'employer_id': self.employer_id,
            'company_name': User.query.get(self.employer_id).company_name if self.employer_id else None,
            'title': self.title,
            'description': self.description,
            'requirements': self.requirements,
            'location': self.location,
            'remote_type': self.remote_type,
            'salary_range': f"{self.salary_min} - {self.salary_max} {self.currency}" if self.salary_min and self.salary_max else None,
            'job_type': self.job_type,
            'experience_level': self.experience_level,
            'skills_required': self.skills_required,
            'benefits': self.benefits,
            'status': self.status,
            'views_count': self.views_count,
            'applications_count': self.applications_count,
            'posted_at': self.posted_at.isoformat() if self.posted_at else None
        }

class Application(db.Model):
    """Application Model - Job applications"""
    __tablename__ = 'applications'
    
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    cover_letter = db.Column(db.Text)
    resume_url = db.Column(db.String(500))
    portfolio_url = db.Column(db.String(500))
    salary_expectation = db.Column(db.Integer)
    notice_period = db.Column(db.Integer)
    status = db.Column(db.String(50), default='pending')  # pending, reviewed, shortlisted, rejected, hired
    employer_notes = db.Column(db.Text)
    reviewed_at = db.Column(db.DateTime)
    applied_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        job = Job.query.get(self.job_id)
        return {
            'id': self.id,
            'job_id': self.job_id,
            'job_title': job.title if job else None,
            'company_name': User.query.get(job.employer_id).company_name if job and job.employer_id else None,
            'cover_letter': self.cover_letter,
            'status': self.status,
            'applied_at': self.applied_at.isoformat() if self.applied_at else None
        }

class SavedJob(db.Model):
    """Saved Jobs Model - User saved jobs"""
    __tablename__ = 'saved_jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'), nullable=False)
    saved_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    __table_args__ = (db.UniqueConstraint('user_id', 'job_id', name='unique_saved_job'),)

class Notification(db.Model):
    """Notification Model - User notifications"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.String(50))  # application, job, message, system, alert
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    data = db.Column(db.JSON, default=dict)
    is_read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# ============================================
# AUTHENTICATION DECORATORS
# ============================================

def token_required(f):
    """Decorator to verify JWT token"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'error': 'Token is missing'}), 401
        
        try:
            token = token.split(' ')[1]  # Remove 'Bearer ' prefix
            data = jwt.decode(token, app.config['JWT_SECRET'], algorithms=['HS256'])
            current_user = User.query.get(data['user_id'])
            if not current_user:
                return jsonify({'error': 'User not found'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated

def role_required(*roles):
    """Decorator to check user roles"""
    def decorator(f):
        @wraps(f)
        def decorated(current_user, *args, **kwargs):
            if current_user.role not in roles:
                return jsonify({'error': 'Permission denied'}), 403
            return f(current_user, *args, **kwargs)
        return decorated
    return decorator

# ============================================
# API ENDPOINTS
# ============================================

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

# ========== AUTHENTICATION ENDPOINTS ==========

@app.route('/api/v1/auth/register', methods=['POST'])
def register():
    """
    User registration
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            password:
              type: string
            role:
              type: string
              enum: ['employee', 'employer', 'recruiter']
    responses:
      201:
        description: User created successfully
      400:
        description: Invalid input
      409:
        description: Email already exists
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'password', 'role']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if user exists
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Email already registered'}), 409
        
        # Create new user
        user = User(
            email=data['email'],
            name=data['name'],
            role=data['role'],
            company_name=data.get('company_name'),
            phone=data.get('phone'),
            location=data.get('location')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }, app.config['JWT_SECRET'], algorithm='HS256')
        
        # Send welcome email (async)
        send_welcome_email.delay(user.email, user.name)
        
        return jsonify({
            'message': 'User created successfully',
            'user': user.to_dict(),
            'token': token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/auth/login', methods=['POST'])
def login():
    """
    User login
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            email:
              type: string
            password:
              type: string
    responses:
      200:
        description: Login successful
      401:
        description: Invalid credentials
    """
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not user.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate token
        token = jwt.encode({
            'user_id': user.id,
            'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
        }, app.config['JWT_SECRET'], algorithm='HS256')
        
        return jsonify({
            'message': 'Login successful',
            'user': user.to_dict(),
            'token': token
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== USER ENDPOINTS ==========

@app.route('/api/v1/users/me', methods=['GET'])
@token_required
def get_current_user(current_user):
    """Get current user profile"""
    return jsonify(current_user.to_dict()), 200

@app.route('/api/v1/users/me', methods=['PUT'])
@token_required
def update_current_user(current_user):
    """Update current user profile"""
    try:
        data = request.get_json()
        
        # Update allowed fields
        allowed_fields = ['name', 'phone', 'location', 'bio', 'skills', 'company_name']
        for field in allowed_fields:
            if field in data:
                setattr(current_user, field, data[field])
        
        db.session.commit()
        return jsonify({'message': 'Profile updated', 'user': current_user.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/users/me/applications', methods=['GET'])
@token_required
def get_user_applications(current_user):
    """Get current user's applications"""
    applications = Application.query.filter_by(user_id=current_user.id).all()
    return jsonify([app.to_dict() for app in applications]), 200

# ========== JOB ENDPOINTS ==========

@app.route('/api/v1/jobs', methods=['GET'])
def get_jobs():
    """
    Get all jobs with filters
    ---
    tags:
      - Jobs
    parameters:
      - name: page
        in: query
        type: integer
        default: 1
      - name: limit
        in: query
        type: integer
        default: 20
      - name: keyword
        in: query
        type: string
      - name: location
        in: query
        type: string
      - name: job_type
        in: query
        type: string
    """
    try:
        # Get query parameters
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        keyword = request.args.get('keyword', '')
        location = request.args.get('location', '')
        job_type = request.args.get('job_type', '')
        
        # Build query
        query = Job.query.filter_by(status='active')
        
        if keyword:
            query = query.filter(
                db.or_(
                    Job.title.ilike(f'%{keyword}%'),
                    Job.description.ilike(f'%{keyword}%')
                )
            )
        
        if location:
            query = query.filter(Job.location.ilike(f'%{location}%'))
        
        if job_type:
            query = query.filter_by(job_type=job_type)
        
        # Paginate
        paginated = query.order_by(Job.posted_at.desc()).paginate(page=page, per_page=limit, error_out=False)
        
        return jsonify({
            'jobs': [job.to_dict() for job in paginated.items],
            'total': paginated.total,
            'page': page,
            'pages': paginated.pages
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/jobs', methods=['POST'])
@token_required
@role_required('employer', 'recruiter')
def create_job(current_user):
    """Create a new job posting"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'description', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create job
        job = Job(
            employer_id=current_user.id,
            title=data['title'],
            description=data['description'],
            requirements=data.get('requirements', []),
            location=data['location'],
            remote_type=data.get('remote_type', 'onsite'),
            salary_min=data.get('salary_min'),
            salary_max=data.get('salary_max'),
            job_type=data.get('job_type', 'full-time'),
            experience_level=data.get('experience_level', 'mid'),
            skills_required=data.get('skills_required', []),
            benefits=data.get('benefits', [])
        )
        
        db.session.add(job)
        db.session.commit()
        
        # Send notifications (async)
        notify_new_job.delay(job.id)
        
        return jsonify({
            'message': 'Job created successfully',
            'job': job.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """Get job by ID"""
    job = Job.query.get_or_404(job_id)
    
    # Increment view count
    job.views_count += 1
    db.session.commit()
    
    return jsonify(job.to_dict()), 200

@app.route('/api/v1/jobs/<int:job_id>', methods=['PUT'])
@token_required
@role_required('employer', 'recruiter')
def update_job(current_user, job_id):
    """Update job posting"""
    try:
        job = Job.query.get_or_404(job_id)
        
        # Check ownership
        if job.employer_id != current_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Permission denied'}), 403
        
        data = request.get_json()
        
        # Update allowed fields
        allowed_fields = ['title', 'description', 'requirements', 'location', 
                         'remote_type', 'salary_min', 'salary_max', 'job_type', 
                         'experience_level', 'skills_required', 'benefits', 'status']
        
        for field in allowed_fields:
            if field in data:
                setattr(job, field, data[field])
        
        db.session.commit()
        return jsonify({'message': 'Job updated', 'job': job.to_dict()}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/jobs/<int:job_id>', methods=['DELETE'])
@token_required
@role_required('employer', 'recruiter', 'admin')
def delete_job(current_user, job_id):
    """Delete job posting"""
    try:
        job = Job.query.get_or_404(job_id)
        
        # Check ownership
        if job.employer_id != current_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Permission denied'}), 403
        
        db.session.delete(job)
        db.session.commit()
        
        return jsonify({'message': 'Job deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ========== APPLICATION ENDPOINTS ==========

@app.route('/api/v1/applications', methods=['POST'])
@token_required
@role_required('employee')
def apply_for_job(current_user):
    """Apply for a job"""
    try:
        data = request.get_json()
        job_id = data.get('job_id')
        
        if not job_id:
            return jsonify({'error': 'job_id required'}), 400
        
        # Check if already applied
        existing = Application.query.filter_by(job_id=job_id, user_id=current_user.id).first()
        if existing:
            return jsonify({'error': 'Already applied for this job'}), 409
        
        # Create application
        application = Application(
            job_id=job_id,
            user_id=current_user.id,
            cover_letter=data.get('cover_letter'),
            salary_expectation=data.get('salary_expectation'),
            notice_period=data.get('notice_period')
        )
        
        db.session.add(application)
        
        # Increment application count on job
        job = Job.query.get(job_id)
        if job:
            job.applications_count += 1
        
        db.session.commit()
        
        # Send notifications (async)
        notify_application_submitted.delay(application.id)
        
        return jsonify({
            'message': 'Application submitted successfully',
            'application': application.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/applications/<int:application_id>/status', methods=['PUT'])
@token_required
@role_required('employer', 'recruiter')
def update_application_status(current_user, application_id):
    """Update application status"""
    try:
        application = Application.query.get_or_404(application_id)
        job = Job.query.get(application.job_id)
        
        # Check permission (only job owner can update)
        if job.employer_id != current_user.id and current_user.role != 'admin':
            return jsonify({'error': 'Permission denied'}), 403
        
        data = request.get_json()
        new_status = data.get('status')
        
        if new_status not in ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']:
            return jsonify({'error': 'Invalid status'}), 400
        
        application.status = new_status
        application.reviewed_at = datetime.utcnow()
        application.employer_notes = data.get('notes')
        
        db.session.commit()
        
        # Notify applicant
        notify_status_change.delay(application.id, new_status)
        
        return jsonify({
            'message': 'Application status updated',
            'status': new_status
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

# ========== SEARCH ENDPOINTS ==========

@app.route('/api/v1/search/jobs', methods=['GET'])
def search_jobs():
    """Advanced job search"""
    try:
        query = request.args.get('q', '')
        page = request.args.get('page', 1, type=int)
        
        if not query:
            return jsonify({'error': 'Search query required'}), 400
        
        # Simple search (can be upgraded to Elasticsearch)
        jobs = Job.query.filter(
            db.or_(
                Job.title.ilike(f'%{query}%'),
                Job.description.ilike(f'%{query}%'),
                Job.requirements.cast(db.String).ilike(f'%{query}%')
            ),
            Job.status == 'active'
        ).paginate(page=page, per_page=20)
        
        return jsonify({
            'query': query,
            'total': jobs.total,
            'jobs': [job.to_dict() for job in jobs.items]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ========== DASHBOARD ENDPOINTS ==========

@app.route('/api/v1/dashboard/employer', methods=['GET'])
@token_required
@role_required('employer', 'recruiter')
def employer_dashboard(current_user):
    """Get employer dashboard data"""
    try:
        # Get employer's jobs
        jobs = Job.query.filter_by(employer_id=current_user.id).all()
        
        # Get applications for these jobs
        job_ids = [job.id for job in jobs]
        applications = Application.query.filter(Application.job_id.in_(job_ids)).all() if job_ids else []
        
        # Calculate stats
        total_jobs = len(jobs)
        total_applications = len(applications)
        active_jobs = len([j for j in jobs if j.status == 'active'])
        
        # Applications by status
        applications_by_status = {
            'pending': len([a for a in applications if a.status == 'pending']),
            'reviewed': len([a for a in applications if a.status == 'reviewed']),
            'shortlisted': len([a for a in applications if a.status == 'shortlisted']),
            'rejected': len([a for a in applications if a.status == 'rejected']),
            'hired': len([a for a in applications if a.status == 'hired'])
        }
        
        return jsonify({
            'stats': {
                'total_jobs': total_jobs,
                'active_jobs': active_jobs,
                'total_applications': total_applications,
                'applications_by_status': applications_by_status
            },
            'recent_jobs': [job.to_dict() for job in jobs[:5]],
            'recent_applications': [app.to_dict() for app in applications[:10]]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# ============================================
# CELERY ASYNC TASKS
# ============================================

@celery.task
def send_welcome_email(user_email, user_name):
    """Send welcome email asynchronously"""
    # Implement email sending logic here
    print(f"Sending welcome email to {user_email}")
    # mail.send(...)
    return True

@celery.task
def notify_new_job(job_id):
    """Notify subscribers about new job"""
    print(f"Notifying subscribers about job {job_id}")
    # Implement notification logic
    return True

@celery.task
def notify_application_submitted(application_id):
    """Notify employer about new application"""
    print(f"Notifying employer about application {application_id}")
    return True

@celery.task
def notify_status_change(application_id, new_status):
    """Notify applicant about status change"""
    print(f"Notifying applicant about status change to {new_status}")
    return True

# ============================================
# ERROR HANDLERS
# ============================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

# ============================================
# DATABASE INITIALIZATION
# ============================================

def init_db():
    """Initialize database with sample data"""
    db.create_all()
    
    # Check if data already exists
    if User.query.first():
        return
    
    # Create sample employer
    employer = User(
        email='employer@jhasons.com',
        name='Jha & Sons',
        role='employer',
        company_name='Jha & Sons',
        email_verified=True
    )
    employer.set_password('123456')
    db.session.add(employer)
    
    # Create sample employee
    employee = User(
        email='prashumishra714@gmail.com',
        name='Prashu Mishra',
        role='employee',
        email_verified=True
    )
    employee.set_password('123456')
    db.session.add(employee)
    
    db.session.commit()
    
    # Create sample jobs
    sample_jobs = [
        Job(
            employer_id=employer.id,
            title='Senior Software Engineer',
            description='Looking for an experienced software engineer...',
            requirements=['Python', 'Django', 'React', 'PostgreSQL'],
            location='Remote',
            remote_type='remote',
            salary_min=120000,
            salary_max=150000,
            job_type='full-time',
            experience_level='senior',
            skills_required=['Python', 'React', 'AWS'],
            status='active'
        ),
        Job(
            employer_id=employer.id,
            title='Frontend Developer',
            description='Join our frontend team...',
            requirements=['React', 'TypeScript', 'Tailwind CSS'],
            location='New York, NY',
            remote_type='hybrid',
            salary_min=90000,
            salary_max=120000,
            job_type='full-time',
            experience_level='mid',
            skills_required=['React', 'JavaScript', 'CSS'],
            status='active'
        )
    ]
    
    for job in sample_jobs:
        db.session.add(job)
    
    db.session.commit()
    print("Database initialized with sample data")

# ============================================
# MAIN ENTRY POINT
# ============================================

if __name__ == '__main__':
    # Create upload folder if not exists
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Initialize database
    with app.app_context():
        init_db()
    
    # Run app
    app.run(host='0.0.0.0', port=5000, debug=True)
