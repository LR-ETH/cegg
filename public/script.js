


async function lookupContract() {
    // Get the contract address entered by the user
    const contractAddress = document.getElementById("contract-address").value;
    if (!contractAddress) {
      alert("Please enter a contract address.");
      return;
    }
  
    // Show the result box
    const resultContainer = document.getElementById("result");
    resultContainer.style.display = "block";

     
     
  
    // Construct the API URLs for retrieving contract information
    const apiKey = "XQ6RMSN73U26J63PD4QSPIPVG1EQD3MMSQ";
    const abiUrl = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;
    const ownerUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${contractAddress}&tag=latest&apikey=${apiKey}`;
    const balanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${contractAddress}&tag=latest&apikey=${apiKey}`;
    const codeUrl = `https://api.etherscan.io/api?module=proxy&action=eth_getCode&address=${contractAddress}&tag=latest&apikey=${apiKey}`;
  
    // Make API requests to retrieve the contract information
    try {
      const [abiResponse, ownerResponse, balanceResponse, codeResponse] = await Promise.all([
        fetch(abiUrl),
        fetch(ownerUrl),
        fetch(balanceUrl),
        fetch(codeUrl),
      ]);
      const [abiData, ownerData, balanceData, codeData] = await Promise.all([
        abiResponse.json(),
        ownerResponse.json(),
        balanceResponse.json(),
        codeResponse.json(),
      ]);
  
      // Check if the contract is verified
      const isVerified = abiData.status === "1";
  
      // Parse the contract ABI to get the contract owner
      const contractABI = JSON.parse(abiData.result);
      const contractOwner = contractABI.find((item) => item.type === "function" && item.name === "owner");
  
      // Convert the contract balance from wei to ether
      const balanceInWei = Number(balanceData.result);
      const balanceInEther = balanceInWei / 10**18;
  
      // Retrieve the transaction that created the contract and get the "from" field
      const txUrl = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${contractAddress}&sort=asc&apikey=${apiKey}`;
      const txResponse = await fetch(txUrl);
      const txData = await txResponse.json();
      const creatorAddress = txData.result[0].from;
      const creationTimestamp = new Date(parseInt(txData.result[0].timeStamp) * 1000).toString();
  
      // Get the Etherscan URL for the contract address
      const etherscanUrl = `https://etherscan.io/address/${contractAddress}#code`;

      const riskScore = await riskAssessment(balanceInEther, isVerified);
     const contractSummary = await generateContractSummary(contractABI);
     
     

  
      // Display the contract information
      const resultElement = document.getElementById("result");
      resultElement.innerHTML = `
        <h2>Contract Information</h2>
        <br>
        <p>Contract Address: ${contractAddress}</p>
        <p>Creator Address: ${creatorAddress}</p>
        <p>Creation Date: ${creationTimestamp}</p>
        <p>Contract Balance: ${balanceInEther} ETH</p>
        <p>Verification Status: ${isVerified ? "Verified" : "Not Verified"}</p>
        <p>Risk Assesment Score: ${riskScore} /5</p>
        <p>${contractSummary}</p>
        
        
      
  
        
        <p><a id="sourcecode-link" href="${etherscanUrl}" target="_blank">View Source Code</a></p>
        
      `;


      async function riskAssessment(balanceInEther, isVerified, creationTimestamp) {
        let score = 0;
      
        if (balanceInEther == 0) {
          score++;
        }
      
        if (!isVerified) {
          score++;
        }
      
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
      
        const contractCreationDate = new Date(parseInt(creationTimestamp));
      
        if (contractCreationDate < oneMonthAgo) {
          score++;
        }
      
        return score;
      }


     
      
      
     

    }

    catch (error) {
      console.log(error);
      alert("Error retrieving contract information. Please try again later. It may be possible that the contracts ABI information is encoded or not accessible to the public.");
      resultContainer.style.display = "none";

    }
    //${JSON.stringify(contractABI)}
    
    async function generateContractSummary(contractABI) {
      const openaiApiKey = "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";
      const prompt = `you are a assistant, ask if I want coffee`;
      const response = await fetch("https://api.openai.com/v1/engines/gpt-3.5-turbo-0301/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 200,
          temperature: 0.7,
          n: 1,
          stop: "\n",
        }),
      });
      const data = await response.json();
      if (data && data.choices && data.choices.length > 0) {
        return data.choices[0].text.trim();
      } else {
        return "No summary generated by OpenAI API.";
      }
    }
    

    
    

  

  }

  
  