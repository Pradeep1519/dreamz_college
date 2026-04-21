const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxXI67awPe13AYB2ggKPwxzkVHA92NZDruTGeCMCQZhXLHeKh_Sc1rY-LDSPtP062nv/exec';

interface LeadData {
  name: string;
  mobile: string;
  location: string;
  course: string;
}

export async function saveToGoogleSheets(data: LeadData): Promise<boolean> {
  try {
    await fetch(GOOGLE_SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    console.log('✅ Data sent:', data.name);
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error);
    return true; // Return true anyway to not block user
  }
}