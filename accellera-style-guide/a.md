---
style: annex
---

# Annex A **(informative)** Environment setup

## A.1 Download VirtualBox

Visit the VirtualBox website [here][virtualbox] to download the binary for your current host operating system. When using Windows as host operating system, download the platform package for **Windows hosts**. Other platform packages are also available, such as Linux and macOS. After download is completed, install VirtualBox with the defaults settings.

## A.2 Download Ubuntu ISO image

As guest operating system, Linux will be used. In this setup, Xubuntu is selected, an Ubuntu distribution using Xfce as window manager and desktop environment. Alternative linux distributions can use used, as long as they are supporting the Debian package management infrastructure (e.g. `apt`). Download the Xubuntu 22.04.4 64-bit ISO image [here][xubuntu].

## A.3 Create a virtual machine

Open VirtualBox and click on the blue **New** button. It will open a dialog box to specify the creation of a virtual machine, see image below.

{% include figure
   reference="Figure A.1"
   caption="Create virtual machine"
   alt-text=""
   class="fixed"
   images="create_vm.png"
%}

Enter the following information into the fields. Note: replace &lt;user&gt; with your user account.
- Name: Xubuntu 22.04.4 EBW environment
- Folder: C:\Users\&lt;user&gt;\VirtualBox VMs 
- ISO image: C:\Users\&lt;user&gt;\Downloads\xubuntu-22.04.4-desktop-amd64.iso

Click on **Next** to specify the account details, see figure below. In this setup, a new account `accellera` is created. Specify the strong password. Optional is to specify a hostname (e.g., `ebw`) and domain name (e.g., `ebw.virtualbox.org`). Also enable the box *Guest Additions*. After completion, click on **Next**.

{% include figure
   reference="Figure A.2"
   caption="Account username and password (hostname and domain name are optional)"
   alt-text=""
   class="fixed"
   images="vm_account.png"
%}

Specify the memory size and number of processors for the virtual machine, as shown below. There is no need to thick the box *Enable EFI*. After completion, click on **Next**.

{% include figure
   reference="Figure A.3"
   caption="Virtual machine memory and processors"
   alt-text=""
   class="fixed"
   images="vm_hardware.png"
%}

Next, specify the available disk space for the virtual machine, see figure below. It is recommended to define a partition bigger than 10 GB. After completion, click on **Next**.

{% include figure
   reference="Figure A.4"
   caption="Virtual machine disk space"
   alt-text=""
   class="fixed"
   images="vm_disk.png"
%}

The next dialog presents a summary. Check all settings, and in case a change is required, use the **Back** button to update the configuration. If all settings are correct, click **Finish**.

## A.4 Install Xubuntu

The virtual machine starts and installs Xubuntu. Depending on the available resources on your host operating system, installation will take between 10 and 20 minutes. After installation the virtual machine will reboot and shows the login screen. Enter the specified password to login.

To enable sharing of clipboard content between the host OS and virtual machine, use the VirtualBox menu of your virtual machine and select: **Devices** > **Shared Chipboard** > **Bidirectional**. 

To share files between the host OS and the virtual machine, select **Devices** > **Shared Folder** > **Shared Folder Settings**, right-click on **Machine Folders** and select **Add shared folder**. Enter the following information:

* Folder path: `C:\Users\<user>\<shared folder on host OS>`
* Folder name: `shared_folder`
* Mount point: `media`
* Select tick box **automount**
* Select tick box **Make Permanent**

After this, a shared folder located in `/media/sf_shared_folder` is made available, which can be accessed from your host OS via the specified folder path.

For convenience, a Terminal shortcut will be added to the desktop of the virtual machine. For this, open the Application menu by clicking on the icon in the upper left corner. Right-click on **Terminal Emulator** and select **Add to Desktop**. Open the terminal via the Desktop, it will show the following prompt:

    accellera@ebw:~:$

First, a few configurations should be done as superuser (`su`), such as adding user `accellera` to the sudoers group and install some base packages. Enter the following commands in the terminal window. After this, reboot the VM and login as accellera user again.
 
    $ su -
    // enter accellera password
    $ adduser accellera sudo
    $ apt-get install git -y
    $ reboot

After the reboot, open the terminal window again. A workarea called `workarea` is created for the technical documentation.

    $ mkdir workarea
    $ cd workarea
	
Next, a clone of the repository is made, which contains the Accellera documentation flow and templates.

    $ git clone https://github.com/OSCI-WG/tc-documentation.git
    $ cd tc-documentation

NOTE---Each working group can have its own documentation repository.
{:.note}

## A.5 Install documentation flow

Install the Electric Book Works documentation flow by executing the following comment in the repository directory:

    $ cd tc-documentation # or working group specific documentation repository
    $ bash setup.sh

All packages for the documentation flow are installed. Also, Visual Studio Code is installed, which can be used as Markdown editor.


[virtualbox]: https://www.virtualbox.org/wiki/Downloads
[xubuntu]: https://cdimage.ubuntu.com/xubuntu/releases/jammy/release/
