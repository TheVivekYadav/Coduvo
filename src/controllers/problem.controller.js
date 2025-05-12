import { db } from "../libs/db.js";
import { getJudge0LanguageId, poolBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res)=>{
  // going to get all the data from the request body
  const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolution} = req.body;

  // going to check user role once again 
  if (req.user.role !== 'ADMIN'){
    return res.status(403).json({error: "You are not allowed to create a problem"});
  } 

  // loop through each refrence solution for different languages.
  try{
    for(const [language, solutionCode] of Object.entries(referenceSolution)){
      console.log("Language...............")
      const languageId = getJudge0LanguageId(language);

      if (!languageId) return res.status(400).json({error:`Language is ${language} not supported`})

      const submissions = testcases.map(({input, output})=>({
        source_code:solutionCode,
        language_id:languageId,
        stdin:input,
        expected_output:output,
      }));
      console.log(submissions);

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res)=>res.token)

      console.log("Pool Batch --->")

      const results = await poolBatchResults(tokens);
    console.log("Pool batching done")
      for (let i = 0; i < results.length; i++){
        const result = results[i];
        if (result.status.id !== 3){
          return res.status(400).json({error: `Testcase ${i+1} failed for the language ${language}`})
        }

      }
      console.log(`creating new problem------------------------------>`)
      const newProblem = await db.problem.create({
        data:{
          title,description,difficulty, tags, examples, constraints, testcases, codeSnippets, referenceSolution, userId:req.user.id
        }
      });
      console.log("crated------------------->")

      return res.status(201).json(newProblem);

    }
  }catch(error){
    return res.status(500).json({error});
  }

}

 
export const getAllProblems = async (req, res)=>{
  
}

export const getProblemById = async (req, res)=>{
    
}
export const updateProblem = async (req, res)=>{
    
}
export const deleteProblem = async (req, res)=>{
    
}
export const getAllProblemsSolvedByUser = async (req, res)=>{
    
}
