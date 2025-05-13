# Database Setup for APOLLO

This directory contains the initial database structure for the APOLLO (Inventory Management System) project.

## File

- **apollo_ims_emptydb.sql**: This file contains the schema for the APOLLO database. It includes table definitions but no data, allowing you to set up a fresh database.

## Usage Instructions

To use this file to create an empty database structure:

1. Open your terminal or command prompt.
2. Connect to your MariaDB or MySQL server:

   ```bash
   mysql -u username -p
   ```

   Replace `username` with your MariaDB username, and enter your password when prompted.

3. Create a new database (if not already created):

   ```sql
   CREATE DATABASE apolloims;
   ```

4. Import the database structure:

   ```bash
   mysql -u username -p apolloims < path/to/apollo_ims_emptydb.sql
   ```

   Replace `path/to/` with the actual path to this file.

This will set up the `APOLLO` database with the necessary tables but no data.

## Notes

- **Warning**: Ensure that no existing data is overwritten if importing into an existing database.
- This setup is intended for new, empty installations only.

---
