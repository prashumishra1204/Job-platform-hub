// Mock Database
const Database = {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    jobs: JSON.parse(localStorage.getItem('jobs') || '[]'),
    applications: JSON.parse(localStorage.getItem('applications') || '[]'),
    
    // Initialize with sample data
    init() {
        if (this.users.length === 0) {
            this.users.push({
                id: 1,
                name: "Prashu Mishra",
                email: "prashumishra714@gmail.com",
                password: "123456",
                role: "employee",
                createdAt: new Date().toISOString()
            });
            
            this.users.push({
                id: 2,
                name: "Prashu Vishal Abhinav",
                email: "prashumishra@gmail.com",
                password: "123456",
                role: "employer",
                company: "Jha & Sons",
                createdAt: new Date().toISOString()
            });
            
            this.save();
        }
        
        if (this.jobs.length === 0) {
            const sampleJobs = [
                {
                    id: 1,
                    title: "Senior Frontend Developer",
                    company: "Tech Corp",
                    location: "Remote",
                    type: "Full-time",
                    salary: "$120k - $150k",
                    description: "Looking for an experienced React developer...",
                    requirements: ["React", "TypeScript", "5+ years experience"],
                    employerId: 2,
                    postedAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "UX Designer",
                    company: "Design Studio",
                    location: "New York, NY",
                    type: "Full-time",
                    salary: "$90k - $110k",
                    description: "Join our creative team...",
                    requirements: ["Figma", "User Research", "Portfolio"],
                    employerId: 2,
                    postedAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "Backend Engineer",
                    company: "Startup Inc",
                    location: "San Francisco, CA",
                    type: "Remote",
                    salary: "$130k - $160k",
                    description: "Building scalable APIs...",
                    requirements: ["Python", "Django", "PostgreSQL"],
                    employerId: 2,
                    postedAt: new Date().toISOString()
                }
            ];
            this.jobs.push(...sampleJobs);
            this.save();
        }
    },
    
    save() {
        localStorage.setItem('users', JSON.stringify(this.users));
        localStorage.setItem('jobs', JSON.stringify(this.jobs));
        localStorage.setItem('applications', JSON.stringify(this.applications));
    },
    
    getJobs(filters = {}) {
        let filteredJobs = [...this.jobs];
        
        if (filters.keyword) {
            filteredJobs = filteredJobs.filter(job => 
                job.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
                job.company.toLowerCase().includes(filters.keyword.toLowerCase())
            );
        }
        
        if (filters.location) {
            filteredJobs = filteredJobs.filter(job => 
                job.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }
        
        if (filters.type) {
            filteredJobs = filteredJobs.filter(job => job.type === filters.type);
        }
        
        return filteredJobs;
    },
    
    addJob(jobData) {
        const newJob = {
            id: this.jobs.length + 1,
            ...jobData,
            postedAt: new Date().toISOString()
        };
        this.jobs.push(newJob);
        this.save();
        return newJob;
    },
    
    applyForJob(userId, jobId) {
        const existing = this.applications.find(app => app.userId === userId && app.jobId === jobId);
        if (existing) {
            throw new Error("Already applied!");
        }
        
        const application = {
            id: this.applications.length + 1,
            userId,
            jobId,
            appliedAt: new Date().toISOString(),
            status: "pending"
        };
        this.applications.push(application);
        this.save();
        return application;
    },
    
    getUserApplications(userId) {
        return this.applications.filter(app => app.userId === userId)
            .map(app => ({
                ...app,
                job: this.jobs.find(job => job.id === app.jobId)
            }));
    },
    
    getEmployerJobs(employerId) {
        return this.jobs.filter(job => job.employerId === employerId);
    }
};

// Initialize database
Database.init();