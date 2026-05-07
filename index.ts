type GitHubFile = {
    name: string;
    path: string;
    type: "file" | "dir";
    url: string;
    download_url: string | null;
}

const url =  process.argv[2];

if(url === undefined){
    console.error ("❌ Usage: npx ts-node index.ts <github-url>");
     process.exit(1);
};

const parts = url.split("/");
const owner = parts[3];
const repo = parts[4];

fetch(`https://api.github.com/repos/${owner}/${repo}`)
    .then((response)=> response.json())
    .then((data) => {
    if(data.visibility === "public"){
        // console.log("This repository is public and accessible for the audit ! ");
        fetch(`https://api.github.com/repos/${owner}/${repo}/contents`)
            .then((res)=> res.json())
            .then((dataLists :GitHubFile[])=>{
                const gitIgnore = dataLists.find((element)=> element.name === ".gitignore");
                if(gitIgnore){
                    // console.log(" GREAT !! This repository contains a gitignore file", gitIgnore);
                    if(gitIgnore.download_url !== null){
                        fetch(gitIgnore.download_url)
                        .then((res)=> res.text())
                        .then((gitIgnoreContent:string)=> {
                            if(gitIgnoreContent.includes(".env")){
                                console.log("Here is the .env file !");
                            }else{
                                console.log("this repo is CRITICAL as it does not include any .env file !!")
                            }
                        })
                    }
                    
                }else{
                    console.log("CRITICAL ! This repository does not contains any gitignore !")
                }
            })
    }else{
        console.log("This repository is private ane not accessible for the audit !")
        process.exit(1);
    }
  })
    .catch((err)=>{
        console.log("unable to fetch API", err);
    });
