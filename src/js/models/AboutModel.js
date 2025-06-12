// About Model for managing about page data
import BaseModel from "./BaseModel.js";

export default class AboutModel extends BaseModel {
  constructor() {
    super();
    this.teamMembers = this.getTeamMembers();
    this.companyInfo = this.getCompanyInfo();
  }

  // Get team members data
  getTeamMembers() {
    return [
      {
        name: "Yonathan Tirza Karsono",
        role: "Leader & Machine Learning",
        image: "/src/assets/member/Yona.png",
        social: {
          linkedin: "#",
          github: "#"
        }
      },
      {
        name: "Wiefran Varenzo.",
        role: "Machine Learning",
        image: "/src/assets/member/Wiefran.png",
        social: {
          linkedin: "#",
          github: "#"
        }
      },
      {
        name: "Dearni Lambardo Sarargih",
        role: "Machine Learning",
        image: "/src/assets/member/Dearni.png",
        social: {
          linkedin: "#",
          github: "#"
        }
      },
      {
        name: "Rayina Ilham",
        role: "Front-end & Backend",
        image: "/src/assets/member/Rayin.png",
        social: {
          linkedin: "#",
          github: "#"
        }
      },
      {
        name: "Oatse Rizqy Hendarto",
        role: "Front-end & Backend",
        image: "/src/assets/member/Oatse.png",
        social: {
          linkedin: "#",
          github: "#"
        }
      },
      {
        name: "Muhammad Irza Alfarizi",
        role: "Front-end & Backend",
        image: "/src/assets/member/Irza.png",
        social: {
          linkedin: "#",
          github: "#"
        }
      }
    ];
  }

  // Get company information
  getCompanyInfo() {
    return {
      mission: "LoughboroughDublin Travel has a dedicated to connecting travelers from around the world. We believe that sharing travel experiences enriches our understanding of different cultures and creates a global community of explorers.",
      vision: "LoughboroughDublin Travel has a dedicated to connecting travelers from around the world. We believe that sharing travel experiences enriches our understanding of different cultures and creates a global community of explorers.",
      projectInfo: "Our platform allows you to share your travel stories with photos and precise locations, discover new destinations through other travelers' experiences, and connect with like-minded adventurers who share your passion for exploration.",
      description: "We're on a mission to make anemia detection accessible to everyone through innovative technology.",
      values: [
        {
          title: "Innovation",
          description: "Continuously pushing the boundaries of what's possible in healthcare technology.",
          icon: "fas fa-lightbulb"
        },
        {
          title: "Accessibility",
          description: "Making healthcare solutions available to everyone, everywhere.",
          icon: "fas fa-universal-access"
        },
        {
          title: "Accuracy",
          description: "Delivering reliable and precise results you can trust.",
          icon: "fas fa-bullseye"
        },
        {
          title: "Privacy",
          description: "Protecting your personal health information with the highest standards.",
          icon: "fas fa-shield-alt"
        }
      ]
    };
  }

  // Get all about page data
  getAllData() {
    return {
      teamMembers: this.teamMembers,
      companyInfo: this.companyInfo
    };
  }
}
