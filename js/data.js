const Database = {
    users: JSON.parse(localStorage.getItem('users') || '[]'),
    jobs: JSON.parse(localStorage.getItem('jobs') || '[]'),
    applications: JSON.parse(localStorage.getItem('applications') || '[]'),
    
    init() {
        if (this.users.length === 0) {
            // Admin
            this.users.push({id:1,name:"System Admin",email:"admin@jobhub.com",password:"admin123",role:"admin",createdAt:new Date().toISOString()});
            // Employee
            this.users.push({id:2,name:"Prashu Mishra",email:"prashumishra714@gmail.com",password:"123456",role:"employee",createdAt:new Date().toISOString()});
            // Employer
            this.users.push({id:3,name:"Jha & Sons",email:"employer@jhasons.com",password:"123456",role:"employer",company:"Jha & Sons",createdAt:new Date().toISOString()});
            // Recruiter
            this.users.push({id:4,name:"Tech Recruiters",email:"recruiter@techagency.com",password:"123456",role:"recruiter",company:"Tech Recruiters Agency",createdAt:new Date().toISOString()});
            this.save();
        }
        if (this.jobs.length === 0) {
            this.jobs.push({id:1,title:"Senior Software Engineer",company:"Jha & Sons",location:"Remote",type:"Full-time",salary:"$120k - $150k",description:"Experienced software engineer needed",requirements:["React","Node.js"],employerId:3,postedBy:"employer",postedAt:new Date().toISOString()});
            this.jobs.push({id:2,title:"Frontend Developer",company:"Tech Recruiters",location:"New York",type:"Remote",salary:"$90k - $110k",description:"Join a fast-growing startup",requirements:["React","TypeScript"],employerId:4,postedBy:"recruiter",postedAt:new Date().toISOString()});
            this.save();
        }
    },
    
    save() { localStorage.setItem('users',JSON.stringify(this.users)); localStorage.setItem('jobs',JSON.stringify(this.jobs)); localStorage.setItem('applications',JSON.stringify(this.applications)); },
    
    getJobs(filters={}) { let filtered=[...this.jobs]; if(filters.keyword){filtered=filtered.filter(j=>j.title.toLowerCase().includes(filters.keyword.toLowerCase())||j.company.toLowerCase().includes(filters.keyword.toLowerCase()));} if(filters.location){filtered=filtered.filter(j=>j.location.toLowerCase().includes(filters.location.toLowerCase()));} if(filters.type){filtered=filtered.filter(j=>j.type===filters.type);} return filtered; },
    
    addJob(jobData){ const newJob={id:this.jobs.length+1,...jobData,postedAt:new Date().toISOString()}; this.jobs.push(newJob); this.save(); return newJob; },
    
    applyForJob(userId,jobId){ const existing=this.applications.find(a=>a.userId===userId&&a.jobId===jobId); if(existing) throw new Error("Already applied!"); const app={id:this.applications.length+1,userId,jobId,appliedAt:new Date().toISOString(),status:"pending"}; this.applications.push(app); this.save(); return app; },
    
    getUserApplications(userId){ return this.applications.filter(a=>a.userId===userId).map(a=>({...a,job:this.jobs.find(j=>j.id===a.jobId)})); },
    
    getEmployerJobs(employerId){ return this.jobs.filter(j=>j.employerId===employerId); },
    
    getAllUsers(){ return this.users; },
    deleteUser(userId){ this.users=this.users.filter(u=>u.id!==userId); this.save(); },
    updateUserRole(userId,newRole){ const u=this.users.find(u=>u.id===userId); if(u){u.role=newRole; this.save();} },
    getAllApplications(){ return this.applications.map(a=>({...a,job:this.jobs.find(j=>j.id===a.jobId),user:this.users.find(u=>u.id===a.userId)})); }
};

Database.init();
