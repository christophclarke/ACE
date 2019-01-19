# ACE DB Schema

Written in prerequisite order.

## Course Specific

### Department

- (K) Abbreviation
  - CSC, MATH, etc.
- Full Name
  - Computer Science, Math, etc.
- (?) Location
- (?) Dean

### Instructor

- (K) Instructor ID
  - Autogen
- First Name
- Last Name
- Email
- Website

### Course

- (K) Course ID
  - Autogen
- (FK) Department
- Course Number
  - 3380, 290, etc.
- Title
  - Object Oriented Design, etc.
- Credit Hours

### Section

- (K) Section ID
  - Autogen
- (FK) Course ID
- Available
- Enrollment
- Type
  - Lecture, Lab, etc.
- Section Number
- Time Begin
- Time End
- Monday
- Tuesday
- Wednesday
- Thursday
- Friday
- Saturday
- Sunday
- (FK) Room
- Special Enroll
- (FK) Instructor

## Other Information

### Building

- (K) Building Name
- Address

### Room

- (K) Room ID
  - Autogen
- (FK) Building
- Room Number