import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock response based on the sample JSON provided
    const mockResponse = {
      "match_result": {
        "match_score": 78,
        "analysis": "This job as a Fullstack Developer in Bandung presents a solid match for the candidate. The candidate has 7 years of experience, exceeding the minimum requirement of 3 years. Their experience as a Fullstack Developer at PT Mega Kreasi Digital and their proficiency in relevant technologies like JavaScript, Codeigniter, and database management align well with the job's requirements. The candidate's experience with frontend frameworks (React, Next.js) complements their backend skills, making them a suitable candidate. However, the candidate's listed PostgreSQL proficiency is at the beginner level, which might be a slight concern. Also, the role requires on-site work in Bandung for a 3-month contract, which might not align with the candidate's location preference (Bogor). The candidate's experience in multiple industries, including education and digital agencies, is a plus.",
        "recommendations": "For the candidate: Highlight your fullstack experience and relevant project contributions focusing on database interaction. Address your willingness to work on-site in Bandung or express interest in similar roles closer to your preferred location. For the recruiter: Consider the candidate's proficiency in JavaScript and experience with various frameworks as an advantage, even if PostgreSQL proficiency is at the beginner level. Explore the candidate's fullstack capabilities based on their work at PT Mega Kreasi Digital.",
        "key_alignments": [
          "7 years of relevant experience exceeds job requirements",
          "Proficiency in JavaScript, Codeigniter, React, and Next.js",
          "Fullstack experience at PT Mega Kreasi Digital",
          "Experience with database management",
          "Experience in Agile environment"
        ],
        "potential_concerns": [
          "Beginner level proficiency in PostgreSQL",
          "Requirement to work on-site in Bandung for 3 months might not align with candidate's location preferences",
          "Candidate lacks explicit experience in Retail apps, E-commerce, Inventory, or Warehouse systems, although their skills are transferable"
        ],
        "next_steps": "For the candidate: Prepare specific examples of projects that demonstrate your fullstack capabilities, focusing on database interactions and JavaScript proficiency. Research the company and prepare questions about the role. For the recruiter: Conduct a technical interview to evaluate the candidate's practical skills in JavaScript, Codeigniter, and database interaction. Discuss the candidate's interest in the location requirement.",
        "salary_fit": "The candidate's salary expectations (100,000,000 - 200,000,000 IDR) should be assessed against the company's budget for this role. Further discussion will be needed to determine if expectations align.",
        "culture_fit": "The candidate's experience in fast-paced environments and strong communication skills suggest a good cultural fit. Their teamwork and problem-solving abilities are also valuable. The candidate's adaptability score of 0.85 is a positive indicator.",
        "growth_potential": "The role provides good growth potential, allowing the candidate to leverage their existing skills and potentially expand their expertise in specific areas like retail applications or warehouse systems."
      },
      "persona_id": "b231b109-b431-4d7e-9374-547da4ec770c",
      "analysis_timestamp": new Date().toISOString()
    };

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: 'Failed to process job match request' },
      { status: 500 }
    );
  }
}