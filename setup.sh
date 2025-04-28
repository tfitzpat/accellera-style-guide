# Main dependency installation

mkdir download
cd download

sudo apt-get update && apt-get install -y \
  software-properties-common \
  apt-transport-https \
  make \
  gcc \
  build-essential \
  git \
  wget \
  libgif7 \
  libpixman-1-0 \
  libffi-dev \
  libreadline-dev \
  zlib1g-dev \
  graphicsmagick \
  dos2unix \
  ruby-full

# Dependencies specifically for Puppeteer on unix
sudo apt-get install -y \
  libasound2 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libcairo2 \
  libdrm2 \
  libgbm1 \
  libnss3 \
  libpango-1.0-0 \
  libxkbcommon-x11-0 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  curl \
  git

# Install nodejs 20.x
sudo curl -k -sL https://deb.nodesource.com/setup_20.x > node_setup.sh
sudo bash node_setup.sh
sudo apt-get install nodejs -y

# Install libssl1.1
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.0g-2ubuntu4_amd64.deb
sudo dpkg -i libssl1.1_1.1.0g-2ubuntu4_amd64.deb

# Install libgif7
wget http://archive.ubuntu.com/ubuntu/pool/main/g/giflib/libgif7_5.1.2-0.2_amd64.deb
sudo dpkg -i libgif7_5.1.2-0.2_amd64.deb

# Install PrinceXML for printing to PDF
wget --no-check-certificate https://www.princexml.com/download/prince_11.4-1_ubuntu18.04_amd64.deb 
sudo dpkg -i prince_11.4-1_ubuntu18.04_amd64.deb

# Install pandoc for document conversion
wget https://github.com/jgm/pandoc/releases/download/2.5/pandoc-2.5-1-amd64.deb
sudo dpkg -i ./pandoc-2.5-1-amd64.deb

# Install vscode
wget -O- https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor | sudo tee /usr/share/keyrings/vscode.gpg
echo deb [arch=amd64 signed-by=/usr/share/keyrings/vscode.gpg] https://packages.microsoft.com/repos/vscode stable main | sudo tee /etc/apt/sources.list.d/vscode.list
sudo apt update
sudo apt install code

# Install chrome
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb

# Update npm
sudo npm install -g npm@latest

# Install Gulp cli app
sudo npm install --global gulp-cli

cd ..

# Set paths for Ruby gems
echo '# Define Ruby Gems path to ~/gems' >> ~/.bashrc
echo 'export GEM_HOME="$HOME/gems"' >> ~/.bashrc
echo 'export PATH="$HOME/gems/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Install bundler and jekyll
sudo gem install jekyll bundler

# install gems
sudo bundle install

# you might need this to resolve version conficts 
#bundle update --bundler
#bundle install
#bundle update
#bundle clean --force

# Install Microsoft Core Fonts
echo ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true | sudo debconf-set-selections
sudo apt-get install ttf-mscorefonts-installer -y

# due to zscaler, disable CA check
export NODE_TLS_REJECT_UNAUTHORIZED=0 

# Install local npm packages for EBW
npm i
