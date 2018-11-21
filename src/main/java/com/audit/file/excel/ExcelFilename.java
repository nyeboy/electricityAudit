package com.audit.file.excel;

public enum ExcelFilename
{
	BTSR_ROOM_SEITCH("BTSRROOMSWITCH",1),BTST_ROOM("BTSRROOM",2),RATED_POWER("RATEDPOWER",3);
	
	private final String fileName;
	private final int index;
	
	ExcelFilename(final String fileName, int index)
	{
		this.fileName = fileName;
		this.index = index;
	}
	
	public static int getIndex(String fileName)
	{
		for(ExcelFilename name : ExcelFilename.values())
		{
			if(fileName.equals(name.fileName))
			{
				return name.index;
			}
		}
		
		return 0;
	}
	
	@Override
	public String toString()
	{
        return fileName;
    }
}
