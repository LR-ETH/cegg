const disconnectButton = document.getElementById('disconnect-wallet');
const connectButton = document.getElementById('connect-button');
const profilePic = document.getElementById('profile-pic');

// check if MetaMask is installed
if (typeof window.ethereum !== 'undefined') {
  // enable the connect button
  connectButton.addEventListener('click', async () => {
    try {
      // request permission to access the user's account
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // handle the response
      const userAddress = accounts[0];
      console.log(`Connected to MetaMask with address: ${userAddress}`);

      // get the user's profile picture from the OpenSea API
      const response = await fetch(`https://api.opensea.io/api/v1/account/${userAddress}/assets/`);
      const json = await response.json();
      let profileImageUrl = "";

      if (Array.isArray(json.assets) && json.assets.length > 0) {
        // if the user has assets, get the image from the first asset in the list
        profileImageUrl = json.assets[0].image_preview_url;
      } else {
        // if the user has no assets, use a default profile picture
        profileImageUrl = "default-profile-pic.png";
      }

      // show the profile picture and hide the Connect Wallet button
      profilePic.src = profileImageUrl;
      profilePic.style.display = 'inline';
      connectButton.style.display = 'none';

    } catch (error) {
      console.error(error);
    }
  });
} else {
  console.error('MetaMask is not installed');
}

